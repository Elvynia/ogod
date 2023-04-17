import { Driver } from "@ogod/game-core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { RenderState, Renderer, RendererSubject } from "../render/state";

export interface GameEngineSource<
    S extends Record<string, any> = Record<string, any>,
    A extends string = string,
    C = OffscreenCanvas> {
    actionHandler: Record<A | 'engine', Subject<any>>;
    dispose: Function;
    game$: RendererSubject<S>;
    state$: Subject<S>;
    target$: ReplaySubject<C>;
}

export interface GameEngineSink<
    S extends Record<string, any> = Record<string, any>,
    R = any> {
    game$?: Observable<RenderState<S>>;
    reflect$?: Observable<R>;
    renderer$?: Observable<Renderer<S>[]>;
    state$: Observable<S>;
    update$?: Observable<any>;
}

export type GameEngineDriver<
    S extends Record<string, any> = Record<string, any>,
    A extends string = string,
    R = any,
    C = OffscreenCanvas>
    = Driver<GameEngineSink<S, R>, GameEngineSource<S, A, C>>;
