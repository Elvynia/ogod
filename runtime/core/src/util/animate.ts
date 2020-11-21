import { map, takeWhile, scan, startWith, bufferCount, switchMap, tap } from 'rxjs/operators';
import { OgodRuntimeEngine } from '../engine/runtime';
import { Observable, OperatorFunction } from 'rxjs';

declare var self: OgodRuntimeEngine;

export function ogodAnimateDuration$(ms: number): Observable<any> {
    return self.update$.pipe(
        scan((time, delta) => {
            if (time < ms && time + delta > ms) {
                return ms;
            }
            return time + delta;
        }, 0),
        map((time) => time / ms),
        takeWhile(t => t <= 1)
    );
}

export function ogodAnimateDistance(distance: number) {
    return (source$) => source$.pipe(
        map((value: number) => value * distance)
    );
}

export function ogodAnimatePrevAndCurrent(initialValue): OperatorFunction<number, number[]> {
    return (source$) =>
        source$.pipe(
            startWith(initialValue),
            bufferCount(2)
        );
}
