import { animationFrames, concatWith, defer, finalize, map, Observable, of, takeUntil, takeWhile, tap, EMPTY } from 'rxjs';
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

export function makeRandomBall$(reset$: Observable<void>, objects: BallState, x: number, y: number) {
    return defer(() => {
        const duration = Math.max(1000, 3500 * Math.random());
        const target = { x, y };
        const start = {
            x: x + (150 - Math.random() * 300),
            y: y + (150 - Math.random() * 300),
        };
        const dx = target.x - start.x;
        const dy = target.y - start.y;
        const obj = {
            id: randNum(8).toString(),
            x: start.x,
            y: start.y,
            s: 1,
            c: randomColor(),
            v: 0,
            shape: randShape()
        };
        objects[obj.id] = obj;
        return animationFrames().pipe(
            takeWhile(({ elapsed }) => elapsed <= duration),
            map(({ elapsed }) => {
                const v = elapsed / duration;
                return {
                    x: v * dx + start.x,
                    y: v * dy + start.y,
                    v: v,
                    s: (1 - v) * 30,
                };
            }),
            tap(({ x, y, v, s }) => {
                obj.x = x;
                obj.y = y;
                obj.v = v;
                obj.s = s;
            }),
            tap({
                complete: () => delete objects[obj.id],
            }),
            takeUntil(reset$),
            concatWith(defer(() => {
                if (!objects[obj.id]) {
                    return EMPTY;
                }
                const duration = 500;
                return animationFrames().pipe(
                    takeWhile(({ elapsed }) => elapsed <= duration),
                    map(({ elapsed }) => {
                        const v = elapsed / duration;
                        return {
                            v: 1 - v,
                            s: 100 * v,
                        };
                    }),
                    tap(({ s, v }) => {
                        obj.s = s;
                        obj.v = v;
                    })
                );
            })),
            finalize(() => delete objects[obj.id]),
            map(() => objects),
            concatWith(of(objects))
        );
    });
}
