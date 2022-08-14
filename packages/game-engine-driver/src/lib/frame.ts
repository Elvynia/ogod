import { expand, filter, map, Observable, of, share } from 'rxjs';
import { FrameData } from './frame.data';
import { clampTo30FPS } from './util';

export function calculateStep(prevFrame?: FrameData): Observable<FrameData> {
    return new Observable<FrameData>((observer: any) => {
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
    map((frame: FrameData) => frame.deltaTime),
    share()
);
