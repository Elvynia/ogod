import { GameEngineDriver, GameEngineOptions, GameEngineSink, GameEngineSource } from '@ogod/game-core';
import { animationFrames, buffer, concatMap, filter, map, pairwise, share, switchMap, takeUntil, tap, withLatestFrom } from "rxjs";
import { makeEngineActionHandlers } from '../action/make';
import { makeGameEngineOptions } from '../options/make';
import { makeRuntime$ } from "../runtime/make";

export function makeGameEngineDriver(options: GameEngineOptions = makeGameEngineOptions()): GameEngineDriver {
    const action$ = options.actionHandlers;
    const frame$ = animationFrames();
    const state$ = options.state$;
    const update$ = frame$.pipe(
        pairwise(),
        map(([prev, cur]) => (cur.elapsed - prev.elapsed) / 1000),
        share()
    );
    return (sink$: Promise<GameEngineSink>): GameEngineSource => {
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
