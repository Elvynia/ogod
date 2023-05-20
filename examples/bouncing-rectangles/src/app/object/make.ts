import { FeatureKey, makeFeatureObject$ } from '@ogod/game-engine-driver';
import { AsyncSubject, filter, first, map, switchMap, takeWhile, withLatestFrom } from 'rxjs';
import { waitForCamera } from '../camera/make';
import { Camera } from '../camera/state';
import { Rect, makeRect, updateMovement } from '../rect';
import { AppState, WorkerSources } from '../state';
import { ObjectState } from './state';

export function makeFeatureObject(sources: WorkerSources, { x, y }, camera: Camera): FeatureKey<ObjectState, string> {
    const rect = makeRect({
        x,
        y: camera.height - y,
        dynamic: true
    }, sources.World.instance, camera.scale);
    const value$ = new AsyncSubject<Rect>();
    // FIXME: Should be batched.
    sources.GameEngine.game$.pipe(
        takeWhile(() => rect.health > 0)
    ).subscribe({
        next: (delta) => updateMovement(delta, rect, camera),
        complete: () => {
            sources.World.instance.DestroyBody(rect.body);
            value$.complete();
        }
    });
    return {
        key: rect.id,
        publishOnComplete: true,
        publishOnCreate: true,
        value$,
        value: rect
    };
}

export function makeFeatureObjects(sources: WorkerSources): FeatureKey<AppState, 'objects'> {
    sources.World.contact$.pipe(
        filter((contact) => contact.touching === 1),
        withLatestFrom(sources.GameEngine.state$),
        map(([{ idA, idB }, state]) => {
            const ids = [];
            if (state.objects[idA]) {
                ids.push(state.objects[idA])
            }
            if (state.objects[idB]) {
                ids.push(state.objects[idB]);
            }
            return ids;
        })
    ).subscribe((rects: Rect[]) => rects.forEach((rect) => --rect.health));
    return {
        key: 'objects',
        publishOnCreate: true,
        publishOnNext: true,
        value$: makeFeatureObject$({
            key$: waitForCamera(sources).pipe(
                switchMap((state) => sources.GameEngine.action$.getHandler('objects').pipe(
                    map((pos) => makeFeatureObject(sources, pos, state.camera)),
                ))
            ),
            state$: sources.GameEngine.state$.pipe(
                map((s) => s.objects),
                first()
            )
        }),
        value: {}
    };
}
