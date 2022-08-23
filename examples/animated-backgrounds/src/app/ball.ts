import gsap, { Elastic, Expo, Linear } from 'gsap';
import { concat, concatWith, defer, EMPTY, finalize, from, Observable, of, takeUntil, tap } from 'rxjs';
import { Shape, shapes } from './render';

export interface Ball {
    id: string;
    x: number;
    y: number;
    v: number;
    s: number;
    c: string;
    shape: Shape;
}

export interface BallState {
    [id: string]: Ball;
}

function randNum(length: number = 4): number {
    return Math.floor(Math.random() * Math.pow(10, length));
}

function colorPart() {
    return Math.floor(Math.random() * 256).toString(16);
}

function randomColor() {
    return `#${colorPart()}${colorPart()}${colorPart()}`;
}

function randShape(): Shape {
    return shapes[Math.floor(Math.random() * shapes.length)];
}

function randSize(max: number) {
    return Math.max(max, Math.round(Math.random() * max));
}

function randBall(x: number, y: number): Ball {
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
export function makeRandomBall$(reset$: Observable<void>, objects: BallState) {
    return (x: number, y: number) => {
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
            finalize(() => delete objects[obj.id])
        );
        return concat(
            of(objects),
            updateBall$,
            of(objects)
        )
    }
}
