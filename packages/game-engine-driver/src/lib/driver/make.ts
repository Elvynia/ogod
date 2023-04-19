import { EngineAction } from '@ogod/game-core';
import { ReplaySubject, Subject } from "rxjs";
import { makeActionListenerEngine } from '../action/make';
import { makeGame$ } from '../game/make';
import { GameEngineOptions } from '../option/state';
import { RendererSubject } from '../render/state';
import { makeUpdate$ } from '../update/make';
import { GameEngineDriver, GameEngineSink, GameEngineSource } from './state';

/**
 *
 * @param options GameEngineOptions<S, A> parameters to control driver properties at creation.
 * @returns GameEngineDriver<S, A, R> a driver that can be used with game-run package.
 */
export function makeDriverGameEngine<
    S extends Record<string, any> = any,
    A extends string = any,
    R = any,
    C = OffscreenCanvas>
    (options: GameEngineOptions<S, A> = { actionKeys: [] }): GameEngineDriver<S, A, R, C> {
    const state$ = options.state$ || new ReplaySubject<S>(1);
    const game$ = new RendererSubject<S>();
    const target$ = new ReplaySubject<C>(1);
    return (sink$: Promise<GameEngineSink<S, R>>): GameEngineSource<S, A, C> => {
        console.debug('[GameEngine] Created');
        sink$.then((sink) => {
            if (sink.game$) {
                sink.game$.subscribe(game$);
            } else {
                makeGame$({ state$, update$: sink.update$ || makeUpdate$() }).subscribe(game$);
            }
            if (sink.renderer$) {
                sink.renderer$.subscribe(game$.renderers$);
            }
            if (sink.reflect$) {
                if (options.workerContext) {
                    sink.reflect$.subscribe((state) => options.workerContext!.postMessage(state));
                } else {
                    throw new Error('[GameEngine] Worker context is required when using reflect mode');
                }
            }
            sink.state$.subscribe(state$);
            console.debug('[GameEngine] Initialized');
        });
        const actionHandler = {
            engine: new Subject<EngineAction>()
        } as Record<A | 'engine', Subject<any>>;
        options.actionKeys.forEach((ak) => actionHandler[ak] = new Subject());
        const source = {
            actionHandler,
            dispose: () => {
                game$.complete();
                state$.complete();
                Object.keys(source.actionHandler).forEach((k) => source.actionHandler[k as A].complete());
                console.debug('[GameEngine] Disposed');
            },
            game$,
            state$,
            target$
        } as const satisfies GameEngineSource<S, A, C>;
        if (options.workerContext) {
            options.workerContext.onmessage = (event) => {
                try {
                    source.actionHandler[event.data.key as A].next(event.data.value);
                } catch (e) {
                    console.error('cannot send action for event data: ', event.data, e);
                }
            };
        }
        makeActionListenerEngine({ source, workerContext: options.workerContext });
        return source;
    };
}
