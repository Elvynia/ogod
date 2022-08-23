import { animationFrames, buffer, filter, map, pairwise, share, withLatestFrom } from "rxjs";
import { Stream } from "xstream";
import { FeatureState } from "../feature/state";
import { makeRuntime$ } from "../runtime/make";
import { RuntimeState } from '../runtime/state';
import { GameEngineOptions, GameEngineSource, makeGameEngineOptions } from './state';

export function makeGameEngineDriver<S extends FeatureState>(options: GameEngineOptions<S> = makeGameEngineOptions()) {
    const action$ = options.actionHandlers;
    const frame$ = animationFrames();
    const state$ = options.state$;
    const update$ = frame$.pipe(
        pairwise(),
        map(([prev, cur]) => (cur.elapsed - prev.elapsed) / 1000),
        share()
    );
    if (options.workerContext) {
        if (options.reflectHandler) {
            state$.pipe(
                buffer(update$),
                map((states) => states.pop()),
                filter((state) => !!state),
                map((state: any) => options.reflectHandler!(state))
            ).subscribe((state) => options.workerContext!.postMessage(state));
        }
        options.workerContext.onmessage = (event: any) => {
            const handler$ = action$[event.data.key];
            handler$.next(event.data.value);
            if (event.data.complete) {
                handler$.complete();
            }
        };
        action$.close.subscribe(() => options.workerContext!.close());
        const actualClose = self.close;
        self.close = () => {
            options.dispose && options.dispose();
            actualClose();
        };
    }
    return function gameEngineDriver(sinks: Stream<RuntimeState<S>>): GameEngineSource<S> {
        makeRuntime$(sinks, state$).subscribe(state$);
        return {
            action$,
            dispose: () => {
                console.log('Stopping game engine');
                state$.complete();
                Object.keys(action$).forEach((k) => action$[k].complete());
            },
            frame$,
            state$,
            render$: update$.pipe(
                withLatestFrom(state$)
            ),
            update$
        };
    };
}
