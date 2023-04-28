import { WorkerActionInit } from "@ogod/game-core";
import { Observable } from "rxjs";
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
export function makeDriverGameEngine<S, A, R, U, C>
    (params: Partial<GameEngineOptions<U, S, A, C>>): GameEngineDriver<S, A, R, U, C> {
    const options = {
        ...makeGameEngineOptionsDefaults<U, S, A, C>(),
        ...params
    };
    return (sink$: Promise<GameEngineSink<S, R, U>>): GameEngineSource<S, A, U, C> => {
        console.debug('[GameEngine] Created');
        sink$.then((sink) => {
            if (sink.action$) {
                sink.action$.subscribe(options.action$);
            }
            if (sink.game$) {
                sink.game$.subscribe(options.game$);
            } else {
                makeGame$<U, S>({
                    state$: options.state$,
                    update$: makeUpdate$() as Observable<U>
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
        const source = {
            action$: options.action$,
            dispose: () => {
                options.game$.complete();
                options.state$.complete();
                options.action$.complete();
                console.debug('[GameEngine] Disposed');
            },
            game$: options.game$.asObservable(),
            renderTarget$: options.renderTarget$,
            state$: options.state$.asObservable()
        };
        // FIXME: Cannot use partial typing on listeners if using generics en source argument.
        options.listeners.forEach((listener) => listener(source as any as GameEngineSource));
        if (options.workerContext) {
            options.workerContext.onmessage = (event) => {
                try {
                    source.action$.getHandler(event.data.key).next(event.data.value);
                } catch (e) {
                    console.error('cannot send action for event data: ', event.data, e);
                }
            };
            options.workerContext.postMessage(WorkerActionInit);
        }
        return source;
    };
}
