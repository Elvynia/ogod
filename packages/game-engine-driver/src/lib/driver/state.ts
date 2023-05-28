import { Driver } from "@ogod/game-core";
import { Observable, Subject } from "rxjs";
import { ActionSubject, ActionSubjectChanges } from "../action/state";
import { EngineFn, EngineSubject } from "../engine/state";
import { StateSubject } from "../state/state";
import { UpdateState } from "../update/state";

export interface GameEngineSource<
    S extends object = any,
    A = any,
    U = UpdateState,
    C = OffscreenCanvas
> {
    action$: ActionSubject<A>;
    dispose: Function;
    engine$: EngineSubject<U>;
    renderTarget$: Subject<C>;
    state$: StateSubject<S>;
    workerContext?: DedicatedWorkerGlobalScope;
}

export interface GameEngineSink<
    S extends object = any,
    R = any,
    U = UpdateState
> {
    action$?: Observable<ActionSubjectChanges>;
    reflect$?: Observable<R>;
    render$?: Observable<EngineFn<U>[]>;
    state$: Observable<S>;
    system$?: Observable<EngineFn<U>[]>;
}

export type GameEngineDriver<
    S extends object = any,
    A = any,
    R = any,
    U = UpdateState,
    C = OffscreenCanvas
> = Driver<GameEngineSink<S, R, U>, GameEngineSource<S, A, U, C>>;
