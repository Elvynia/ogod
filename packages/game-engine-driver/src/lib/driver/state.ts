import { Driver } from "@ogod/game-core";
import { Observable, Subject } from "rxjs";
import { ActionSubject, ActionSubjectChanges } from "../action/state";
import { RenderState, Renderer } from "../render/state";
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
    game$: Observable<RenderState<U, S>>;
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
    game$?: Observable<RenderState<U, S>>;
    reflect$?: Observable<R>;
    renderer$?: Observable<Renderer<U, S>[]>;
    state$: Observable<S>;
}

export type GameEngineDriver<
    S extends object = any,
    A = any,
    R = any,
    U = UpdateState,
    C = OffscreenCanvas
> = Driver<GameEngineSink<S, R, U>, GameEngineSource<S, A, U, C>>;
