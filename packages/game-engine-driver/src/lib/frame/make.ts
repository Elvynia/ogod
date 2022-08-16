import { expand, filter, map, Observable, of, share } from 'rxjs';
import { Frame } from './state';

// FIXME: Check on new animationFrame observable.
export function calculateStep(prevFrame?: Frame): Observable<Frame> {
    return new Observable<Frame>((observer: any) => {
        requestAnimationFrame((frameStartTime) => {
            const deltaTime = prevFrame ? (frameStartTime - prevFrame.frameStartTime) / 1000 : 0;
            observer.next({
                frameStartTime,
                deltaTime,
            });
        });
    });
};

export function makeFrame$() {
    return of(undefined).pipe(
        expand((val) => calculateStep(val)),
        filter((frame) => frame !== undefined),
        map((frame: Frame) => frame.deltaTime),
        share()
    );
}
