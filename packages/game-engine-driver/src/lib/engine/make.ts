import { animationFrames, buffer, filter, map, pairwise, share, withLatestFrom } from "rxjs";
import { Stream } from "xstream";
import { makeAction$ } from "../action/make";
import { FeatureState } from "../feature/state";
import { makeRuntime$ } from "../runtime/make";
import { RuntimeState } from '../runtime/state';
import { GameEngineOptions, GameEngineSource, makeGameEngineOptionsDefault } from './state';

export function makeGameEngineDriver<S extends FeatureState>(initState: S,
    options: GameEngineOptions<S> = makeGameEngineOptionsDefault()) {
    const state$ = options.state$;
    const frame$ = animationFrames();
    const update$ = frame$.pipe(
        pairwise(),
        map(([prev, cur]) => (cur.elapsed - prev.elapsed) / 1000),
        share()
    );
    const action$ = makeAction$(initState, options.additionalActionHandler);
    if (options.workerContext) {
        state$.pipe(
            buffer(update$),
            map((states) => states.pop()),
            filter((state) => !!state),
            map((state: any) => options.reflectHandler(state))
        ).subscribe((state) => options.workerContext!.postMessage(state));
        options.workerContext.onmessage = (event: any) => {
            const handler$ = action$.select(event.data.key);
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
        state$.next(initState);
        return {
            action$,
            dispose: () => {
                console.log('Stopping game engine');
                state$.complete();
                action$.close.complete();
                Object.keys(initState).forEach((k) => action$.select(k).complete());
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
