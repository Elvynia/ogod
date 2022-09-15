import { makeFeature$ } from '@ogod/game-engine-driver';
import { concat, filter, map, mergeMap, of, takeWhile, tap } from 'rxjs';
import { makeRect, Rect } from '../rect';
import { Camera } from '../screen/state';
import { AppState, WorkerSources } from '../state';

export const updateMovement = (_, obj: Rect, screen: Camera) => {
    const pos = obj.body.GetPosition();
    const newPos = pos.Clone();
    const appWidth = screen.width / screen.scale;
    const appHeight = screen.height / screen.scale;
    if (pos.x < 0) {
        newPos.Set(pos.x + appWidth, appHeight - pos.y);
    } else if (pos.x > appWidth) {
        newPos.Set(pos.x - appWidth, appHeight - pos.y);
    }
    if (pos.y < 0) {
        newPos.Set(appWidth - newPos.x, pos.y + appHeight);
    } else if (pos.y > appHeight) {
        newPos.Set(appWidth - newPos.x, pos.y - appHeight);
    }
    if (pos.x !== newPos.x || pos.y !== newPos.y) {
        obj.body.SetTransformVec(newPos, 0);
    }
    obj.x = Math.round(obj.body.GetPosition().x * screen.scale);
    obj.y = Math.round(obj.body.GetPosition().y * screen.scale);
};

export function makeFeatureObjects(sources: WorkerSources, target: AppState) {
    sources.World.contact$.pipe(
        filter((contact) => contact.touching === 1),
        map(({ idA, idB }) => {
            const ids = [];
            if (target.objects[idA]) {
                ids.push(idA)
            }
            if (target.objects[idB]) {
                ids.push(idB);
            }
            return ids;
        })
    ).subscribe((ids: string[]) => ids.forEach((id) => --target.objects[id].health));
    return makeFeature$({
        key: 'objects',
        value$: sources.GameEngine.actions.objects.pipe(
            mergeMap(({ x, y }) => {
                const rect = makeRect({
                    x,
                    y: target.camera.height - y,
                    dynamic: true
                }, sources.World.instance, target.camera.scale);
                target.objects[rect.id] = rect;
                return concat(
                    of(target.objects),
                    sources.GameEngine.update$.pipe(
                        takeWhile((delta) => rect.health > 0),
                        tap({
                            next: (delta) => updateMovement(delta, rect, target.camera),
                            complete: () => {
                                sources.World.instance.DestroyBody(rect.body);
                                delete target.objects[rect.id];
                            }
                        }),
                        map(() => target.objects)
                    ),
                    of(target.objects)
                );
            }),
        ),
        target
    })
}
