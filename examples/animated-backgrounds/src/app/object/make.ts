import { tweenObject } from '@ogod/core';
import { FeatureKey, makeStateObject } from '@ogod/driver-engine';
import { EMPTY, concatWith, defer, first, map, takeUntil } from "rxjs";
import { AppState, WorkerSources } from '../state';
import { randNum, randShape, randSize, randomColor } from '../util';
import { CanvasObject, ObjectState } from "./state";

function easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
function easeInOutElastic(x: number): number {
    const c5 = (2 * Math.PI) / 4.5;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : x < 0.5
                ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}
function easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

function randBall(x: number, y: number): CanvasObject {
    return {
        id: randNum(8).toString(),
        x,
        y,
        s: randSize(50),
        c: randomColor(),
        v: 0,
        shape: randShape()
    }
}

export function makeRandomBall$(sources: WorkerSources) {
    return (x: number, y: number): FeatureKey<ObjectState, string> => {
        const duration = 2000;
        const obj = randBall(x + (150 - Math.random() * 300), y + (150 - Math.random() * 300));
        return {
            key: obj.id,
            publishOnComplete: true,
            publishOnCreate: true,
            value$: tweenObject({
                source: obj,
                easeFn: easeInOutElastic,
                duration,
                target: {
                    x: { value: x },
                    y: { value: y },
                    s: {
                        value: 1,
                        easeFn: easeInOutSine
                    },
                    v: {
                        value: 1,
                        easeFn: easeInOutSine
                    }
                },
                update$: sources.GameEngine.engine$
            }).pipe(
                takeUntil(sources.GameEngine.action$.getHandler('reset')),
                concatWith(defer(() => {
                    if (obj.v == 1) {
                        return EMPTY;
                    }
                    return tweenObject({
                        source: obj,
                        easeFn: easeOutExpo,
                        duration: 400,
                        target: {
                            v: { value: 0.1 },
                            s: { value: 500 }
                        },
                        update$: sources.GameEngine.engine$
                    });
                }))
            ),
            value: obj
        };
    }
}


export function makeFeatureObjects(sources: WorkerSources): FeatureKey<AppState, 'objects'> {
    const randomBall$ = makeRandomBall$(sources);
    return {
        key: 'objects',
        publishOnNext: true,
        value$: makeStateObject({
            key$: sources.GameEngine.action$.getHandler('objects').pipe(
                map(({ x, y }) => randomBall$(x, y))
            ),
            state: sources.GameEngine.state$.pipe(
                map((s) => s.objects),
                first()
            )
        }),
        value: {} as ObjectState
    };
}
