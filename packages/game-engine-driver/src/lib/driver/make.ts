import { ActionState, GameEngineDriver, GameEngineOptions, GameEngineSink, GameEngineSource } from '@ogod/game-core';
import { animationFrames, buffer, concatMap, filter, last, map, pairwise, share, takeUntil, withLatestFrom } from "rxjs";
import { makeEngineActionHandlers } from '../action/make';
import { makeGameEngineOptions } from '../options/make';

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
    return (sink$: Promise<GameEngineSink<S>>): GameEngineSource<S, A, AS> => {
        console.debug('[GameEngine] Created');
        sink$.then((sink) => {
            console.debug('[GameEngine] Initialized');
            sink.feature$.pipe(
                takeUntil(state$.pipe(last()))
            ).subscribe(state$);
            if (sink.reflect$) {
                sink.reflect$.pipe(
                    options.reflectMapper((reflect) => {
                        let source = state$.pipe(
                            buffer(update$),
                            map((states) => states.pop()),
                            filter((state) => !!state),
                            map((state: any) => reflect.value!(state))
                        );
                        if (reflect.takeUntil$) {
                            source = source.pipe(
                                takeUntil(reflect.takeUntil$)
                            )
                        }
                        return source;
                    })
                ).subscribe((state) => options.workerContext!.postMessage(state));
            }
            if (sink.render$) {
                sink.render$.pipe(
                    options.renderMapper((render) => {
                        let source = sources.render$.pipe(
                            map((args: any[]) => [...args, render.value])
                        );
                        if (render.takeUntil$) {
                            source = source.pipe(
                                takeUntil(render.takeUntil$)
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
