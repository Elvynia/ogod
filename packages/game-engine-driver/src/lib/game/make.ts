import { Observable, withLatestFrom } from "rxjs";
import { RenderState } from "../render/state";
import { UpdateState } from "../update/state";

export function makeGame$<U = UpdateState, S = any>(params: {
    state$: Observable<S>;
    update$: Observable<U>;
}): Observable<RenderState<U, S>> {
    return params.update$.pipe(
        withLatestFrom(params.state$)
    );
}
