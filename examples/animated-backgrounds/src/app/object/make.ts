import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { AnyShape, Circle, PI2, Rect, makeRandInRange, makeRandShape } from '@ogod/examples-common';
import { EMPTY, concatWith, defer, first, map, takeUntil } from "rxjs";
import { AppState, WorkerSources } from '../state';
import { makeObjectAnimation, makeObjectAnimationReset } from './animate';
import { ObjectState } from "./state";

function makeRandObject(x: number, y: number): AnyShape {
    const obj = makeRandShape({
        x,
        y,
        opacity: 0
    });
    switch (obj.type) {
        case 'circle':
            return {
                ...obj,
                radius: makeRandInRange(5, 50),
            } as Circle;
        case 'rect':
            const size = makeRandInRange(0, 50);
            return {
                ...obj,
                angle: makeRandInRange(0, PI2 * 100) / 100,
                width: size,
                height: size
            } as Rect;
    }
}

export function makeObject(sources: WorkerSources, x: number, y: number): FeatureKey<ObjectState, string> {
    const obj = makeRandObject(x + (150 - Math.random() * 300), y + (150 - Math.random() * 300));
    return {
        key: obj.id,
        publishOnComplete: true,
        publishOnCreate: true,
        value$: makeObjectAnimation(obj, { x, y }, sources.Engine.engine$).pipe(
            takeUntil(sources.Engine.action$.getHandler('reset')),
            concatWith(defer(() => {
                if (obj.opacity == 1) {
                    return EMPTY;
                }
                return makeObjectAnimationReset(obj, sources.Engine.engine$);
            }))
        ),
        value: obj
    };
}


export function makeFeatureObjects(sources: WorkerSources): FeatureKey<AppState, 'objects'> {
    return {
        key: 'objects',
        publishOnCreate: true,
        publishOnNext: true,
        value$: makeStateObject({
            key$: sources.Engine.action$.getHandler('objects').pipe(
                map(({ x, y }) => makeObject(sources, x, y))
            ),
            state: sources.Engine.state$.pipe(
                map((s) => s.objects),
                first()
            )
        }),
        value: {} as ObjectState
    };
}
