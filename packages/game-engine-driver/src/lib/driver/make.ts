import { EngineAction } from '@ogod/game-core';
import { Subject } from "rxjs";
import { makeActionListenerEngine } from '../action/make';
import { makeGame$ } from '../game/make';
import { makeGameEngineOptionsDefaults } from '../option/make';
import { GameEngineOptions } from '../option/state';
import { makeUpdate$ } from '../update/make';
import { GameEngineDriver, GameEngineSink, GameEngineSource } from './state';

/**
 *
 * @param options GameEngineOptions<S, A> parameters to control driver properties at creation.
 * @returns GameEngineDriver<S, A, R> a driver that can be used with game-run package.
 */
export function makeDriverGameEngine<
    S = any,
    A extends string = any,
    R = any,
    C = OffscreenCanvas>
    (options: GameEngineOptions<S, A, C> = makeGameEngineOptionsDefaults()): GameEngineDriver<S, A, R, C> {
    return (sink$: Promise<GameEngineSink<S, R>>): GameEngineSource<S, A, C> => {
        console.debug('[GameEngine] Created');
        sink$.then((sink) => {
            if (sink.game$) {
                sink.game$.subscribe(options.game$);
            } else {
                makeGame$({
                    state$: options.state$,
                    update$: makeUpdate$()
                }).subscribe(options.game$);
            }
            if (sink.renderer$) {
                sink.renderer$.subscribe(options.game$.renderers$);
            }
            if (sink.reflect$) {
                if (options.workerContext) {
                    sink.reflect$.subscribe((state) => options.workerContext!.postMessage(state));
                } else {
                    throw new Error('[GameEngine] Worker context is required when using reflect mode');
                }
            }
            sink.state$.subscribe(options.state$);
            console.debug('[GameEngine] Initialized');
        });
        const actionHandlers = {
            engine: new Subject<EngineAction>()
        } as Record<A | 'engine', Subject<any>>;
        if (options.actionHandlerDefaults) {
            Object.assign(actionHandlers, options.actionHandlerDefaults);
        }
        options.actionKeys.filter((ak) => !actionHandlers[ak])
            .forEach((ak) => actionHandlers[ak] = new Subject());
        const source = {
            actionHandlers,
            dispose: () => {
                options.game$.complete();
                options.state$.complete();
                Object.keys(source.actionHandlers).forEach((k) => source.actionHandlers[k as A].complete());
                console.debug('[GameEngine] Disposed');
            },
            game$: options.game$.asObservable(),
            renderTarget$: options.renderTarget$,
            state$: options.state$.asObservable()
        };
        if (options.workerContext) {
            options.workerContext.onmessage = (event) => {
                try {
                    source.actionHandlers[event.data.key as A].next(event.data.value);
                } catch (e) {
                    console.error('cannot send action for event data: ', event.data, e);
                }
            };
        }
        makeActionListenerEngine({ source, workerContext: options.workerContext });
        return source;
    };
}
