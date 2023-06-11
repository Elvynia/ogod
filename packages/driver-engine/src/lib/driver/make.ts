import { MessageEngineInit } from "@ogod/core";
import { makeEngineOptionsDefaults } from '../option/make';
import { EngineOptions } from '../option/state';
import { DriverEngine, EngineSink, EngineSource } from './state';

/**
 *
 * @param options EngineOptions<S, A> parameters to control driver properties at creation.
 * @returns EngineDriver<S, A, R> a driver that can be used with run package.
 */
export function makeDriverEngine<
    S extends object,
    A = any,
    R = any,
    C = OffscreenCanvas
>(params?: Partial<EngineOptions<S, A, C>>): DriverEngine<S, A, R, C> {
    const options = makeEngineOptionsDefaults<S, A, C>(params);
    return (sink$: Promise<EngineSink<S, R>>): EngineSource<S, A, C> => {
        let id = 'Engine';
        if (options.workerContext?.name) {
            id += '#' + options.workerContext.name;
        }
        console.debug(`[${id}] Created`);
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
                    throw new Error(`[${id}] Worker context is required when using reflect mode`);
                }
            }
            if (sink.systems) {
                sink.systems.pre$?.subscribe((systems) => options.engine$.systems.pre = systems);
                sink.systems.post$?.subscribe((systems) => options.engine$.systems.post = systems);
            }
            sink.state$.subscribe(options.state$);
            console.debug(`[${id}] Initialized`);
        });
        const dispose = () => {
            options.action$.complete();
            options.engine$.complete();
            options.state$.complete();
            console.debug(`[${id}] Disposed`);
        };
        options.engine$.subscribe({
            error: (e) => {
                if (options.workerContext) {
                    options.workerContext.close();
                } else {
                    dispose();
                }
                console.error(`[${id}] An error occured in animationFrame loop and stopped the engine:\n`, e);
            }
        });
        const source = {
            action$: options.action$,
            engine$: options.engine$,
            dispose,
            state$: options.state$,
            target$: options.target$,
            workerContext: options.workerContext
        };
        // FIXME: Cannot use partial typing on listeners if using generics en source argument.
        options.listeners.forEach((listener) => listener(source as any as EngineSource));
        if (options.workerContext) {
            options.workerContext.onmessage = (event) => {
                try {
                    source.action$.getHandler(event.data.key).next(event.data.value);
                } catch (e) {
                    console.error(`[${id}] Cannot send action for event data: `, event.data, e);
                }
            };
            options.workerContext.postMessage(MessageEngineInit);
        }
        return source;
    };
}
