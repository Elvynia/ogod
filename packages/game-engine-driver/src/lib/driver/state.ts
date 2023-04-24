import { Driver } from "@ogod/game-core";
import { Observable, Subject } from "rxjs";
import { ActionSubject, ActionSubjectChanges } from "../action/state";
import { RenderState, Renderer } from "../render/state";
import { UpdateState } from "../update/state";

export interface GameEngineSource<
    S = any,
    A extends string = string,
    U = UpdateState,
    C = OffscreenCanvas> {
    action$: ActionSubject<A>;
    dispose: Function;
    game$: Observable<RenderState<U, S>>;
    renderTarget$: Subject<C>;
    state$: Observable<S>;
    workerContext?: DedicatedWorkerGlobalScope;
}

export interface GameEngineSink<
    S = any,
    R = any,
    U = UpdateState,
    A extends string = string> {
    action$?: Observable<ActionSubjectChanges<A>>;
    game$?: Observable<RenderState<U, S>>;
    reflect$?: Observable<R>;
    renderer$?: Observable<Renderer<U, S>[]>;
    state$: Observable<S>;
}

export type GameEngineDriver<
    S = any,
    A extends string = string,
    R = any,
    U = UpdateState,
    C = OffscreenCanvas>
    = Driver<GameEngineSink<S, R, U, A>, GameEngineSource<S, A, U, C>>;
