import run from '@cycle/run';
import { GameEngineOptions, GameEngineSource, isEngineActionCanvas } from '@ogod/game-core';
import { makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { gsap } from 'gsap';
import { filter, first, mergeMap, of, startWith, switchMap, tap } from 'rxjs';
import { makeRandomBall$ } from './app/ball';
import { makeRender } from './app/render';
import { AppState } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: { GameEngine: GameEngineSource<AppState> }) {
    const objects = {};
    const randomBall$ = makeRandomBall$(sources.GameEngine.action$['reset'], objects);
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    return {
        GameEngine: of({
            app$: sources.GameEngine.action$.engine.pipe(
                filter(isEngineActionCanvas),
                first(),
                switchMap(({ canvas }) => sources.GameEngine.action$.app.pipe(
                    tap((app) => {
                        canvas.width = app.width;
                        canvas.height = app.height;
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
    ...makeGameEngineOptions<AppState, any>(['app', 'objects', 'reset']),
    workerContext: self,
    reflectHandler: of((state) => ({
        objects: Object.keys(state.objects).length
    })),
    makeRender
} as GameEngineOptions<AppState>;
options.dispose = run(main, {
    GameEngine: makeGameEngineDriver(options)
});
