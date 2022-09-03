import { ActionState, GameEngineDriver, GameEngineOptions, GameEngineSink, GameEngineSource } from '@ogod/game-core';
import { animationFrames, buffer, concatMap, filter, map, pairwise, share, switchMap, takeUntil, withLatestFrom } from "rxjs";
import { makeEngineActionHandlers } from '../action/make';
import { makeGameEngineOptions } from '../options/make';
import { makeRuntime$ } from "../runtime/make";

export function makeGameEngineDriver<S = any, A extends string = any, AS extends ActionState<A> = ActionState<A>>
    (options: GameEngineOptions<S, A, AS> = makeGameEngineOptions<S, A, AS>()): GameEngineDriver<S, A, AS> {
    const actions = options.actionHandlers;
    const frame$ = animationFrames();
    const state$ = options.state$;
    const update$ = frame$.pipe(
        pairwise(),
        map(([prev, cur]) => cur.elapsed - prev.elapsed),
        share()
    );
    return (sink$: Promise<GameEngineSink>): GameEngineSource<S, A, AS> => {
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
                sink.renderer$.pipe(
                    concatMap((renderer) => {
                        let source = sources.render$.pipe(
                            map((args: any[]) => [...args, renderer.render])
                        );
                        if (renderer.observable) {
                            source = source.pipe(
                                takeUntil(renderer.observable)
                            );
                        }
                        return source;
                    })
                ).subscribe(([delta, state, render]) => render(delta, state));
            }
        });
        const sources = {
            actions,
            dispose: () => {
                state$.complete();
                Object.keys(actions).forEach((k) => actions[k as keyof AS].complete());
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
            options.workerContext.onmessage = (event: any) => actions[event.data.key as keyof AS].next(event.data.value);
            makeEngineActionHandlers(sources);
        }
        return sources;
    };
}
