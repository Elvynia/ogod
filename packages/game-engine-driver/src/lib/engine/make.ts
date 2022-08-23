import { animationFrames, buffer, filter, map, pairwise, share, switchMap, withLatestFrom } from "rxjs";
import { Stream } from "xstream";
import { makeEngineActionHandlers } from '../action/make';
import { FeatureState } from "../feature/state";
import { makeGameEngineOptions } from '../options/make';
import { GameEngineOptions } from '../options/state';
import { makeRuntime$ } from "../runtime/make";
import { RuntimeState } from '../runtime/state';
import { GameEngineSource } from './state';

export function makeGameEngineDriver<S extends FeatureState>(options: GameEngineOptions<S> = makeGameEngineOptions()) {
    const action$ = options.actionHandlers;
    const frame$ = animationFrames();
    const state$ = options.state$;
    const update$ = frame$.pipe(
        pairwise(),
        map(([prev, cur]) => (cur.elapsed - prev.elapsed) / 1000),
        share()
    );
    return function gameEngineDriver(sinks: Stream<RuntimeState<S>>): GameEngineSource<S> {
        makeRuntime$(sinks, state$).subscribe(state$);
        const sources = {
            action$,
            dispose: () => {
                console.log('Stopping game engine');
                state$.complete();
                Object.keys(action$).forEach((k) => action$[k].complete());
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
            if (options.reflectHandler) {
                options.reflectHandler.pipe(
                    switchMap((reflectHandler) => state$.pipe(
                        buffer(update$),
                        map((states) => states.pop()),
                        filter((state) => !!state),
                        map((state: any) => reflectHandler!(state))
                    ))
                ).subscribe((state) => options.workerContext!.postMessage(state));
            }
            options.workerContext.onmessage = (event: any) => action$[event.data.key].next(event.data.value);
            makeEngineActionHandlers(sources);
        }
        return sources;
    };
}
