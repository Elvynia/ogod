import { buffer, filter, map, Observable } from "rxjs";

export function makeReflect$<
    S = any,
    R = any>
    (params: {
        state$: Observable<S>,
        buffer$: Observable<any>,
        transform: (state: S) => R
    }): Observable<R> {
    return params.state$.pipe(
        buffer(params.buffer$),
        map((states) => states.pop()),
        filter((state): state is S => !!state),
        map((state) => params.transform(state))
    );
}
