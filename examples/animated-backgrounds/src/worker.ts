import { GameEngineSource, isEngineActionCanvas } from '@ogod/game-core';
import { makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { gsap } from 'gsap';
import { filter, first, mergeMap, of, startWith, switchMap, tap } from 'rxjs';
import { BallState, makeRandomBall$ } from './app/ball';
import { makeRender } from './app/render';
import { AppActions, AppState } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: { GameEngine: GameEngineSource<AppState, AppActions> }) {
    const objects = {} as BallState;
    const randomBall$ = makeRandomBall$(sources.GameEngine.action$['reset'], objects);
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    return {
        GameEngine: of({
            app$: sources.GameEngine.action$.engine.pipe(
                filter(isEngineActionCanvas),
                first(),
                switchMap(({ payload }) => sources.GameEngine.action$.app.pipe(
                    tap((app) => {
                        payload.width = app.width;
                        payload.height = app.height;
                    })
                ))
            ),
            objects$: sources.GameEngine.action$.objects.pipe(
                mergeMap(({ x, y }) => randomBall$(x, y)),
                startWith(objects)
            )
        })
    };
}

let options = {
    ...makeGameEngineOptions<AppState, AppActions>(['app', 'objects', 'reset']),
    workerContext: self,
    reflectHandler: of((state) => ({
        objects: Object.keys(state.objects).length
    })),
    makeRender
};
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options)
});
