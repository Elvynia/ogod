import { UpdateState } from "@ogod/core";
import { ReplaySubject } from "rxjs";
import { makeActionEngineListener } from "../action/make";
import { ActionSubjectDefault } from "../action/state";
import { EngineSubjectDefault } from "../engine/state";
import { StateSubjectDefault } from "../state/state";
import { GameEngineOptions } from "./state";

export function makeGameEngineOptionsDefaults<
    U = UpdateState,
    S extends object = any,
    A = any,
    C = OffscreenCanvas>(options: Partial<GameEngineOptions<U, S, A, C>>): GameEngineOptions<U, S, A, C> {
    return {
        action$: options.action$ || new ActionSubjectDefault<A>(),
        engine$: options.engine$ || new EngineSubjectDefault(),
        listeners: options.listeners || [makeActionEngineListener],
        renderTarget$: options.renderTarget$ || new ReplaySubject<C>(1),
        state$: options.state$ || new StateSubjectDefault<S>(1),
        workerContext: options.workerContext
    }
}
