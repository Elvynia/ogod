import { makeGameBox2dDriver } from '@ogod/game-box2d-driver';
import { isEngineActionCanvas } from '@ogod/game-core';
import { makeFeature$, makeFeatureArray, makeFeatureObservable, makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { distinctUntilKeyChanged, EMPTY, filter, first, map, merge, of, ReplaySubject, switchMap } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeFeatureGrounds } from './app/ground/make';
import { makeFeatureObjects } from './app/object/make';
import { makeFeaturePlayer } from './app/player/make';
import { makeReflect$ } from './app/reflect/make';
import { makeRender$ } from './app/render/make';
import { makeFeatureScreen } from './app/screen/make';
import { AppAction, AppState, WorkerSources } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: WorkerSources) {
    return {
        GameEngine: {
            feature$: makeFeature$(merge(
                of(makeFeatureFps(sources.GameEngine)),
                of(makeFeatureObservable('paused', sources.GameEngine.actions.paused)),
                sources.GameEngine.actions.engine.pipe(
                    filter(isEngineActionCanvas),
                    map(({ payload }) => makeFeatureScreen(sources.GameEngine.actions.screen, payload))
                ),
                sources.GameEngine.state$.pipe(
                    filter((state) => !!state.screen),
                    first(),
                    switchMap((state) => of(makeFeatureArray([
                        makeFeatureGrounds(sources, state.screen),
                        makeFeaturePlayer(sources, state.screen),
                        makeFeatureObjects(sources, state.screen)
                    ])))
                )
            )),
            reflect$: makeReflect$(sources),
            render$: makeRender$(sources)
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
