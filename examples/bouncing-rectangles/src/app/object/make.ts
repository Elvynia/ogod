import { FeatureKey, makeStateObject } from '@ogod/game-engine-driver';
import { BehaviorSubject, finalize, first, map, of, switchMap, takeWhile } from 'rxjs';
import { waitForCamera } from '../camera/make';
import { Camera } from '../camera/state';
import { makeRect } from '../rect/make';
import { Rect } from '../rect/state';
import { AppState, WorkerSources } from '../state';
import { randNum } from '../util';
import { ObjectState } from './state';

export const updateMovement = (obj: Rect, camera: Camera) => {
    const pos = obj.body.GetPosition();
    const newPos = pos.Clone();
    const appWidth = camera.width / camera.scale;
    const appHeight = camera.height / camera.scale;
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
    obj.x = Math.round(obj.body.GetPosition().x * camera.scale);
    obj.y = Math.round(obj.body.GetPosition().y * camera.scale);
    obj.angle = -obj.body.GetAngle();
};

export function makeFeatureObject(sources: WorkerSources, { x, y }, camera: Camera): FeatureKey<ObjectState, string> {
    const id = randNum(8).toString();
    const state = makeRect({
        id,
        x,
        y: camera.height - y,
        dynamic: true
    }, sources.World.instance, camera.scale);
    const health$ = new BehaviorSubject(state.health);
    state.body.SetUserData(health$);
    return {
        key: id,
        publishOnComplete: true,
        value$: makeStateObject({
            key$: of({
                key: 'health',
                value$: health$.pipe(
                    takeWhile((health) => health > 0),
                    finalize(() => sources.GameEngine.engine$.pipe(
                        first()
                    ).subscribe(() => sources.World.instance.DestroyBody(state.body)))
                )
            }),
            publishOnCreate: true,
            state
        })
    };
}

export function makeFeatureObjects(sources: WorkerSources): FeatureKey<AppState, 'objects'> {
    return {
        key: 'objects',
        publishOnNext: true,
        value$: makeStateObject({
            key$: waitForCamera(sources).pipe(
                switchMap((state) => sources.GameEngine.action$.getHandler('objects').pipe(
                    map((pos) => makeFeatureObject(sources, pos, state.camera)),
                ))
            ),
            publishOnCreate: true,
            state: {}
        }),
    };
}
