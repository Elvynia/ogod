import { FeatureKey, makeFeatureObject$ } from '@ogod/game-engine-driver';
import gsap, { Elastic, Expo, Linear } from 'gsap';
import { Observable, concatWith, defer, first, from, map, takeUntil } from "rxjs";
import { AppState, WorkerSources } from '../state';
import { randNum, randShape, randSize, randomColor } from '../util';
import { CanvasObject, ObjectState } from "./state";

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

const resetDuration = 400;
export function makeRandomBall$(reset$: Observable<void>) {
    return (x: number, y: number): FeatureKey<ObjectState, string> => {
        const duration = 2000;
        const obj = randBall(x + (150 - Math.random() * 300), y + (150 - Math.random() * 300));
        let tween = gsap.to(obj, {
            x,
            y,
            ease: Elastic.easeInOut,
            duration: duration / 1000
        });
        let tween2 = gsap.to(obj, {
            s: 1,
            v: 1,
            ease: Linear.easeInOut,
            duration: duration / 1000
        });
        const updateBall$ = from(tween.then()).pipe(
            takeUntil(reset$),
            concatWith(defer(() => {
                if (obj.v == 1) {
                    return from(tween2.then());
                }
                tween2.kill();
                tween.vars = {
                    v: 0,
                    s: 500,
                    ease: Expo.easeIn,
                    duration: resetDuration
                };
                tween.invalidate();
                return from(tween.then());
            })),
            map(() => obj),
        );
        return {
            key: obj.id,
            publishOnComplete: true,
            publishOnCreate: true,
            value$: updateBall$,
            value: obj
        };
    }
}


export function makeFeatureObjects(sources: WorkerSources): FeatureKey<AppState, 'objects'> {
    const randomBall$ = makeRandomBall$(sources.GameEngine.action$.getHandler('reset'));
    return {
        key: 'objects',
        publishOnNext: true,
        value$: makeFeatureObject$({
            key$: sources.GameEngine.action$.getHandler('objects').pipe(
                map(({ x, y }) => randomBall$(x, y))
            ),
            state$: sources.GameEngine.state$.pipe(
                map((s) => s.objects),
                first()
            )
        }),
        value: {} as ObjectState
    };
}
