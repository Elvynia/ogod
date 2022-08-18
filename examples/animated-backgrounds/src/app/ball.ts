import { concat, concatWith, defer, EMPTY, finalize, ignoreElements, Observable, of, takeUntil, tap } from 'rxjs';
import { animateObject$ } from './animation';
import { easeInElastic, easeLinear } from './ease';
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

export function makeRandomBall$(frame$: Observable<{ elapsed: number }>, reset$: Observable<void>, objects: BallState) {
    return (x: number, y: number) => {
        let duration = Math.max(1000, 3500 * Math.random());
        const obj = randBall(x + (150 - Math.random() * 300), y + (150 - Math.random() * 300));
        objects[obj.id] = obj;
        const updateBall$ = animateObject$(obj, {
            x: { start: obj.x, end: x, duration, easeFn: easeInElastic },
            y: { start: obj.y, end: y, duration, easeFn: easeInElastic },
            v: { start: obj.v, end: 1, duration, easeFn: easeLinear },
            s: { start: obj.s, end: 1, duration, easeFn: easeInElastic },
        }, frame$).pipe(
            tap({
                complete: () => delete objects[obj.id]
            }),
            takeUntil(reset$),
            concatWith(defer(() => {
                if (!objects[obj.id]) {
                    return EMPTY;
                }
                duration = 400;
                return animateObject$(obj, {
                    v: { start: 1, end: 0, duration, easeFn: easeLinear },
                    s: { start: obj.s, end: obj.s * 3, duration, easeFn: easeLinear },
                }, frame$);
            })),
            finalize(() => delete objects[obj.id])
        );
        return concat(
            of(objects),
            updateBall$.pipe(
                ignoreElements()
            ),
            of(objects)
        )
    }
}
