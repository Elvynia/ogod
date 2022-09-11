import { ActionState, GameEngineDriver, GameEngineOptions, GameEngineSink, GameEngineSource } from '@ogod/game-core';
import { animationFrames, buffer, filter, last, map, Subject, takeUntil, withLatestFrom } from "rxjs";
import { makeEngineActionHandlers } from '../action/make';
import { makeGameEngineOptions } from '../options/make';

export function makeGameEngineDriver<S = any, A extends string = any, R = any, AS extends ActionState<A> = ActionState<A>>
    (options: GameEngineOptions<S, A, R, AS> = makeGameEngineOptions<S, A, R, AS>()): GameEngineDriver<S, A, R, AS> {
    const actions = options.actionHandlers;
    const frame$ = animationFrames();
    const state$ = options.state$;
    const update$ = new Subject<number>();
    return (sink$: Promise<GameEngineSink<S, R>>): GameEngineSource<S, A, R, AS> => {
        console.debug('[GameEngine] Created');
        sink$.then((sink) => {
            sink.feature$.pipe(
                takeUntil(state$.pipe(last()))
            ).subscribe(state$);
            if (sink.update$) {
                sink.update$.subscribe(update$);
            }
            if (sink.reflect$) {
                sink.reflect$.pipe(
                    options.reflectMapper((reflect) => {
                        let source = state$.pipe(
                            buffer(frame$),
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
            console.debug('[GameEngine] Initialized');
        });
        const sources = {
            actions,
            dispose: () => {
                state$.complete();
                update$.complete();
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
