import { ReplaySubject } from "rxjs";
import { makeActionEngineListener } from "../action/make";
import { ActionSubjectDefault } from "../action/state";
import { RendererSubjectDefault } from "../render/state";
import { UpdateState } from "../update/state";
import { GameEngineOptions } from "./state";

export function makeGameEngineOptionsDefaults<
    U = UpdateState,
    S = any,
    A extends string = string,
    C = OffscreenCanvas>(): GameEngineOptions<U, S, A, C> {
    return {
        action$: new ActionSubjectDefault<A>(),
        game$: new RendererSubjectDefault(),
        listeners: [makeActionEngineListener],
        renderTarget$: new ReplaySubject<C>(1),
        state$: new ReplaySubject<S>(1)
    }
}