import { expand, filter, map, Observable, of, share } from 'rxjs';
import { Frame } from './state';
import { clampTo30FPS } from '../util';

export function calculateStep(prevFrame?: Frame): Observable<Frame> {
    return new Observable<Frame>((observer: any) => {
        requestAnimationFrame((frameStartTime) => {
            const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
            observer.next({
                frameStartTime,
                deltaTime,
            });
        });
    }).pipe(map(clampTo30FPS));
};

export const frame$ = of(undefined).pipe(
    expand((val) => calculateStep(val)),
    filter((frame) => frame !== undefined),
    map((frame: Frame) => frame.deltaTime),
    share()
);
