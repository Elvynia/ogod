import { GameEngineSource, isEngineActionCanvas } from '@ogod/game-core';
import { makeFeatureObservable, makeGameEngineDriver, makeGameEngineOptions, makeRenderer } from '@ogod/game-engine-driver';
import { gameRun } from '@ogod/game-run';
import { gsap } from 'gsap';
import { filter, first, map, merge, mergeMap, of, switchMap, tap, delay } from 'rxjs';
import { BallState, makeRandomBall$ } from './app/ball';
import { makeRender } from './app/render';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: { GameEngine: GameEngineSource }) {
    const objects = {} as BallState;
    const randomBall$ = makeRandomBall$(sources.GameEngine.action$['reset'], objects);
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    const app$ = makeFeatureObservable('app', sources.GameEngine.action$.engine.pipe(
        filter(isEngineActionCanvas),
        first(),
        switchMap(({ payload }) => sources.GameEngine.action$.app.pipe(
            tap((app) => {
                payload.width = app.width;
                payload.height = app.height;
            })
        ))
    ));
    const objects$ = makeFeatureObservable('objects', sources.GameEngine.action$.objects.pipe(
        mergeMap(({ x, y }) => randomBall$(x, y))
    ), objects);
    return {
        GameEngine: {
            runtime$: merge(
                of(app$),
                of(objects$)
            ),
            reflector$: of((state) => ({
                objects: Object.keys(state.objects).length
            })),
            renderer$: sources.GameEngine.action$.engine.pipe(
                filter(isEngineActionCanvas),
                map(({ payload }) => makeRenderer(makeRender(payload)))
            )
        }
    };
}

let options = makeGameEngineOptions(self, ['app', 'objects', 'reset']);
options.dispose = gameRun(main, {
    GameEngine: makeGameEngineDriver(options)
});
