import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { isEngineActionCanvas } from '@ogod/game-core';
import { makeFeatureObservable, makeGameEngineDriver, makeGameEngineOptions, makeRenderer, makeFeature$ } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { delayWhen, distinctUntilKeyChanged, EMPTY, filter, first, map, merge, of, ReplaySubject, switchMap } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeFeatureGrounds } from './app/ground/make';
import { makeFeatureObjects } from './app/object/make';
import { makeFeaturePlayer } from './app/player/make';
import { makeReflector$ } from './app/reflector/make';
import { makeRender } from './app/renderer/make';
import { makeFeatureScreen } from './app/screen/make';
import { AppAction, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    const canvas$ = sources.GameEngine.actions.engine.pipe(
        filter(isEngineActionCanvas)
    );
    return {
        GameEngine: {
            runtime$: makeFeature$(merge(
                of(makeFeatureFps(sources.GameEngine)),
                of(makeFeatureObservable('paused', sources.GameEngine.actions.paused)),
                canvas$.pipe(
                    map(({ payload }) => makeFeatureScreen(sources.GameEngine.actions.screen, payload))
                ),
                sources.GameEngine.state$.pipe(
                    filter((state) => !!state.screen),
                    first(),
                    switchMap((state) => merge(
                        of(makeFeatureGrounds(sources, state.screen)),
                        of(makeFeaturePlayer(sources, state.screen)),
                        of(makeFeatureObjects(sources, state.screen))
                    ))
                )
            )),
            reflector$: makeReflector$(sources),
            renderer$: canvas$.pipe(
                delayWhen(() => sources.GameEngine.state$.pipe(
                    filter((state) => state.screen && state.player && !!state.objects),
                    first()
                )),
                map(({ payload }) => makeRenderer(makeRender(payload)))
            )
        },
        World: sources.GameEngine.state$.pipe(
            distinctUntilKeyChanged('paused'),
            map((state: any) => state.paused),
            switchMap((paused) => paused ? EMPTY : sources.GameEngine.update$)
        )
    };
}

let options = makeGameEngineOptions<AppState, AppAction>(self, ['screen', 'objects', 'paused'], {
    playerColor: new ReplaySubject<string>(1)
});
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options),
    World: makeGameBox2dDriver()
});
