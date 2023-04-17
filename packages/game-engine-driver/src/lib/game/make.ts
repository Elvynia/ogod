import { Observable, withLatestFrom } from "rxjs";
import { RenderState } from "../render/state";

export function makeGame$<S = any>(params: {
    state$: Observable<S>;
    update$: Observable<any>
}): Observable<RenderState<S>> {
    return params.update$.pipe(
        withLatestFrom(params.state$)
    );
}
