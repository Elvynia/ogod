import { WorkerActionInit } from "@ogod/game-core";
import { makeGameEngineOptionsDefaults } from '../option/make';
import { GameEngineOptions } from '../option/state';
import { GameEngineDriver, GameEngineSink, GameEngineSource } from './state';

/**
 *
 * @param options GameEngineOptions<S, A> parameters to control driver properties at creation.
 * @returns GameEngineDriver<S, A, R> a driver that can be used with game-run package.
 */
export function makeDriverGameEngine<S extends object, A, R, U, C>
    (params: Partial<GameEngineOptions<U, S, A, C>>): GameEngineDriver<S, A, R, U, C> {
    const options = makeGameEngineOptionsDefaults<U, S, A, C>(params);
    return (sink$: Promise<GameEngineSink<S, R, U>>): GameEngineSource<S, A, U, C> => {
        console.debug('[GameEngine] Created');
        sink$.then((sink) => {
            if (sink.action$) {
                sink.action$.subscribe(options.action$);
            }
            if (sink.render$) {
                sink.render$.subscribe((renders) => options.engine$.renders = renders);
            }
            if (sink.reflect$) {
                if (options.workerContext) {
                    sink.reflect$.subscribe((state) => options.workerContext!.postMessage(state));
                } else {
                    throw new Error('[GameEngine] Worker context is required when using reflect mode');
                }
            }
            if (sink.systems) {
                sink.systems.pre$?.subscribe((systems) => options.engine$.systems.pre = systems);
                sink.systems.post$?.subscribe((systems) => options.engine$.systems.post = systems);
            }
            sink.state$.subscribe(options.state$);
            console.debug('[GameEngine] Initialized');
        });
        const dispose = () => {
            options.action$.complete();
            options.engine$.complete();
            options.state$.complete();
            console.debug('[GameEngine] Disposed');
        };
        options.engine$.subscribe({
            error: (e) => {
                dispose();
                console.error('[GameEngine] An error occured in animationFrame loop and stopped the engine:\n', e);
            }
        });
        const source = {
            action$: options.action$,
            engine$: options.engine$,
            dispose,
            state$: options.state$,
            renderTarget$: options.renderTarget$,
            workerContext: options.workerContext
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
