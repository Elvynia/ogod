import { Driver } from "@ogod/game-core";
import { Observable, Subject } from "rxjs";
import { RenderState, Renderer } from "../render/state";

export interface GameEngineSource<
    S = any,
    A extends string = string,
    C = OffscreenCanvas> {
    actionHandlers: Record<A | 'engine', Subject<any>>;
    dispose: Function;
    game$: Observable<RenderState<S>>;
    renderTarget$: Subject<C>;
    state$: Observable<S>;
}

export interface GameEngineSink<
    S = any,
    R = any> {
    game$?: Observable<RenderState<S>>;
    reflect$?: Observable<R>;
    renderer$?: Observable<Renderer<S>[]>;
    state$: Observable<S>;
}

export type GameEngineDriver<
    S = any,
    A extends string = string,
    R = any,
    C = OffscreenCanvas>
    = Driver<GameEngineSink<S, R>, GameEngineSource<S, A, C>>;
