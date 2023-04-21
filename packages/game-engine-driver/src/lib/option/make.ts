import { ReplaySubject } from "rxjs";
import { RendererSubjectDefault } from "../render/state";
import { GameEngineOptions } from "./state";

export function makeGameEngineOptionsDefaults<
    S = any,
    A extends string = string,
    C = OffscreenCanvas>(): GameEngineOptions<S, A, C> {
    return {
        actionKeys: [],
        game$: new RendererSubjectDefault(),
        renderTarget$: new ReplaySubject<C>(1),
        state$: new ReplaySubject<S>(1)
    }
}