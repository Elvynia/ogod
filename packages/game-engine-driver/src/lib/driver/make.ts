import { ActionHandler, FeatureState, GameEngineDriver, GameEngineOptions, GameEngineSink, GameEngineSource } from '@ogod/game-core';
import { animationFrames, buffer, filter, map, pairwise, share, switchMap, withLatestFrom } from "rxjs";
import { makeEngineActionHandlers } from '../action/make';
import { makeGameEngineOptions } from '../options/make';
import { makeRuntime$ } from "../runtime/make";

export function makeGameEngineDriver<S extends FeatureState, AS = {}, R = any,
    AH extends ActionHandler<Partial<S> & AS> = ActionHandler<Partial<S> & AS>>(
        options: GameEngineOptions<S, AS, AH> = makeGameEngineOptions<S, AS, AH>()): GameEngineDriver<S, AS, R, AH> {
    const action$ = options.actionHandlers;
    const frame$ = animationFrames();
    const state$ = options.state$;
    const update$ = frame$.pipe(
        pairwise(),
        map(([prev, cur]) => (cur.elapsed - prev.elapsed) / 1000),
        share()
    );
    return (sink$: Promise<GameEngineSink<S>>): GameEngineSource<S, AS, AH> => {
        console.debug('[GameEngine] Created');
        sink$.then((sink) => {
            console.debug('[GameEngine] Initialized');
            makeRuntime$(sink.runtime$, state$).subscribe(state$);
            if (sink.reflector$) {
                sink.reflector$.pipe(
                    switchMap((reflectHandler) => state$.pipe(
                        buffer(update$),
                        map((states) => states.pop()),
                        filter((state) => !!state),
                        map((state: any) => reflectHandler!(state))
                    ))
                ).subscribe((state) => options.workerContext!.postMessage(state));
            }
            if (sink.renderer$) {
                sources.render$.pipe(
                    withLatestFrom(sink.renderer$),
                ).subscribe(([[delta, state], render]) => render(delta, state));
            }
        });
        const sources = {
            action$,
            dispose: () => {
                state$.complete();
                Object.keys(action$).forEach((k) => action$[k].complete());
                console.debug('[GameEngine] Disposed');
            },
            frame$,
            options,
            render$: update$.pipe(
                withLatestFrom(state$)
            ),
            state$,
            update$
        };
        if (options.workerContext) {
            options.workerContext.onmessage = (event: any) => action$[event.data.key].next(event.data.value);
            makeEngineActionHandlers(sources);
        }
        return sources;
    };
}
