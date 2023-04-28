import { makeFeature$ } from "@ogod/game-engine-driver";
import gsap, { Elastic, Expo, Linear } from 'gsap';
import { EMPTY, Observable, concat, concatWith, defer, finalize, from, ignoreElements, mergeMap, of, takeUntil, tap } from "rxjs";
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
export function makeRandomBall$(reset$: Observable<void>, objects: ObjectState) {
    return (x: number, y: number): Observable<ObjectState> => {
        const duration = 2000;
        const obj = randBall(x + (150 - Math.random() * 300), y + (150 - Math.random() * 300));
        objects[obj.id] = obj;
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
            tap({
                complete: () => delete objects[obj.id]
            }),
            takeUntil(reset$),
            concatWith(defer(() => {
                if (!objects[obj.id]) {
                    return EMPTY;
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
            finalize(() => delete objects[obj.id]),
            ignoreElements()
        );
        return concat(
            of(objects),
            updateBall$,
            of(objects)
        );
    }
}


export function makeFeatureObjects(sources: WorkerSources, state: AppState) {
    const randomBall$ = makeRandomBall$(sources.GameEngine.action$.getHandler('reset'), state.objects);
    return makeFeature$({
        key: 'objects',
        value$: sources.GameEngine.action$.getHandler('objects').pipe(
            mergeMap(({ x, y }) => randomBall$(x, y))
        ),
        target: state
    });
}
