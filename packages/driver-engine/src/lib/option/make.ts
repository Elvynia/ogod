import { ReplaySubject } from "rxjs";
import { makeActionEngineListener } from "../action/make";
import { ActionSubjectDefault } from "../action/state";
import { EngineSubjectDefault } from "../engine/state";
import { StateSubjectDefault } from "../state/state";
import { EngineOptions } from "./state";

export function makeEngineOptionsDefaults<
    S extends object = any,
    A = any,
    C = OffscreenCanvas>(options?: Partial<EngineOptions<S, A, C>>): EngineOptions<S, A, C> {
    return {
        action$: options?.action$ || new ActionSubjectDefault<A>(),
        engine$: options?.engine$ || new EngineSubjectDefault(),
        listeners: options?.listeners || [makeActionEngineListener()],
        target$: options?.target$ || new ReplaySubject<C>(1),
        state$: options?.state$ || new StateSubjectDefault<S>(1),
        workerContext: options?.workerContext
    }
}
