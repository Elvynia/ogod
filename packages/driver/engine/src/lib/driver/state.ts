import { Driver } from "@ogod/core";
import { Observable, Subject } from "rxjs";
import { ActionSubject, ActionSubjectChanges } from "../action/state";
import { EngineFn, EngineSubject } from "../engine/state";
import { StateSubject } from "../state/state";

export interface EngineSource<
    S extends object = any,
    A = any,
    C = OffscreenCanvas
> {
    action$: ActionSubject<A>;
    dispose: Function;
    engine$: EngineSubject;
    target$: Subject<C>;
    state$: StateSubject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
}

export interface EngineSink<
    S extends object = any,
    R = any
> {
    action$?: Observable<ActionSubjectChanges>;
    reflect$?: Observable<R>;
    render$?: Observable<EngineFn[]>;
    state$: Observable<S>;
    systems?: {
        pre$?: Observable<EngineFn[]>;
        post$?: Observable<EngineFn[]>;
    };
}

export type DriverEngine<
    S extends object = any,
    A = any,
    R = any,
    C = OffscreenCanvas
> = Driver<EngineSink<S, R>, EngineSource<S, A, C>>;
