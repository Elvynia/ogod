import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { BehaviorSubject, finalize, first, map, of, switchMap, takeWhile, withLatestFrom } from 'rxjs';
import { makeRect } from '../rect/make';
import { Rect } from '../rect/state';
import { AppState, WorkerSources } from '../state';
import { randNum } from '../util';
import { ObjectState } from './state';

export const updateMovement = (obj: Rect, state: AppState, canvas: OffscreenCanvas) => {
    const pos = obj.body.GetPosition();
    const newPos = pos.Clone();
    const appWidth = canvas.width / state.scale;
    const appHeight = canvas.height / state.scale;
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
    obj.x = Math.round(obj.body.GetPosition().x * state.scale);
    obj.y = Math.round(obj.body.GetPosition().y * state.scale);
    obj.angle = -obj.body.GetAngle();
};

export function makeFeatureObject(sources: WorkerSources, { x, y }, state: AppState, canvas: OffscreenCanvas): FeatureKey<ObjectState, string> {
    const id = randNum(8).toString();
    const obj = makeRect({
        id,
        x,
        y: canvas.height - y,
        dynamic: true
    }, sources.World.instance, state.scale);
    const health$ = new BehaviorSubject(obj.health);
    obj.body.SetUserData(health$);
    return {
        key: id,
        publishOnComplete: true,
        value$: makeStateObject({
            key$: of({
                key: 'health',
                value$: health$.pipe(
                    takeWhile((health) => health > 0),
                    finalize(() => sources.Engine.engine$.pipe(
                        first()
                    ).subscribe(() => sources.World.instance.DestroyBody(obj.body)))
                )
            }),
            publishOnCreate: true,
            state: obj
        })
    };
}

export function makeFeatureObjects(sources: WorkerSources): FeatureKey<AppState, 'objects'> {
    return {
        key: 'objects',
        publishOnNext: true,
        value$: makeStateObject({
            key$: sources.Engine.state$.pipe(
                withLatestFrom(sources.Engine.target$),
                first(),
                switchMap(([state, canvas]) => sources.Engine.action$.getHandler('objects').pipe(
                    map((pos) => makeFeatureObject(sources, pos, state, canvas)),
                ))
            ),
            publishOnCreate: true,
            state: {}
        }),
    };
}
