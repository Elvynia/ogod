import { animationFrames, combineLatest, endWith, map, Observable, takeWhile, tap } from 'rxjs';

export interface AnimateParams {
    start: number;
    end: number;
    duration: number;
    easeFn: Function;
}

export type AnimateObject<O extends object> = {
    [K in keyof O]: AnimateParams;
}

export function animate$({ start, end, duration, easeFn }: AnimateParams,
    frame$: Observable<{ elapsed: number }> = animationFrames()): Observable<number> {
    return frame$.pipe(
        takeWhile(({ elapsed }) => elapsed < duration),
        map(({ elapsed }) => easeFn(elapsed, start, end, duration)),
        endWith(end)
    );
}

export function animateObject$<O extends object>(obj: O, params: AnimateObject<Partial<O>>,
    frame$: Observable<{ elapsed: number }> = animationFrames()) {
    return combineLatest(Object.keys(params).map((k) => animate$(params[k], frame$).pipe(
        tap((value) => obj[k] = value)
    )));
}
