import { UpdateState } from "@ogod/core";
import { ReplaySubject } from "rxjs";
import { makeActionEngineListener } from "../action/make";
import { ActionSubjectDefault } from "../action/state";
import { EngineSubjectDefault } from "../engine/state";
import { StateSubjectDefault } from "../state/state";
import { EngineOptions } from "./state";

export function makeEngineOptionsDefaults<
    U = UpdateState,
    S extends object = any,
    A = any,
    C = OffscreenCanvas>(options?: Partial<EngineOptions<U, S, A, C>>): EngineOptions<U, S, A, C> {
    return {
        action$: options?.action$ || new ActionSubjectDefault<A>(),
        engine$: options?.engine$ || new EngineSubjectDefault(),
        listeners: options?.listeners || [makeActionEngineListener()],
        target$: options?.target$ || new ReplaySubject<C>(1),
        state$: options?.state$ || new StateSubjectDefault<S>(1),
        workerContext: options?.workerContext
    }
}
