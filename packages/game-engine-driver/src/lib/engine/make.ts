import { animationFrames, buffer, filter, map, pairwise, share, TimestampProvider, withLatestFrom } from "rxjs";
import { Stream } from "xstream";
import { makeAction$ } from "../action/make";
import { FeatureState } from "../feature/state";
import { makeRuntime$ } from "../runtime/make";
import { RuntimeState } from '../runtime/state';
import { GameEngineOptions, GameEngineSource, makeGameEngineOptionsDefault } from './state';

export function makeGameEngineDriver<S extends FeatureState>(initState: S, workerContext?: any,
    options: GameEngineOptions<S> = makeGameEngineOptionsDefault()) {
    const state$ = options.state$;
    const update$ = animationFrames().pipe(
        pairwise(),
        map(([prev, cur]) => (cur.elapsed - prev.elapsed) / 1000),
        share()
    );
    const action$ = makeAction$(initState, options.additionalActionHandler);
    if (workerContext) {
        state$.pipe(
            buffer(animationFrames()),
            map((states) => states.pop()),
            filter((state) => !!state)
        ).subscribe((state) => workerContext.postMessage(state));
        workerContext.onmessage = (event: any) => {
            const handler$ = action$.select(event.data.key);
            handler$.next(event.data.value);
            if (event.data.complete) {
                handler$.complete();
            }
        };
        action$.close.subscribe(() => workerContext.close());
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
            state$,
            render$: update$.pipe(
                withLatestFrom(state$)
            ),
            update$
        };
    };
}
