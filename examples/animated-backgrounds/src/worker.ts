import run from '@cycle/run';
import { GameEngineSource, makeGameEngineDriver, makeGameEngineOptionsDefault, makeFeatureConstant, GameEngineOptions } from '@ogod/game-engine-driver';
import { AsyncSubject, mergeMap, of, startWith, Subject, tap } from 'rxjs';
import { makeRandomBall$ } from './app/ball';
import { makeRender } from './app/render';
import { AppState, initState } from './app/state';
import { gsap } from 'gsap';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: { GameEngine: GameEngineSource<AppState> }) {
    const reset$ = (sources.GameEngine.action$ as any).select('reset');
    let offscreen;
    (sources.GameEngine.action$ as any).select('canvas').subscribe((canvas) => {
        offscreen = canvas;
        const render = makeRender(canvas);
        sources.GameEngine.render$.subscribe(([delta, state]) => render(delta, state));
    });
    const randomBall$ = makeRandomBall$(sources.GameEngine.frame$, reset$, initState.objects);
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    return {
        GameEngine: of({
            app: sources.GameEngine.action$.app.pipe(
                tap((app) => {
                    offscreen.width = app.width;
                    offscreen.height = app.height;
                }),
                startWith(initState.app)
            ),
            objects: sources.GameEngine.action$.objects.pipe(
                mergeMap(({ x, y }) => randomBall$(x, y))
            )
        })
    };
}

let options = {
    ...makeGameEngineOptionsDefault<AppState>(),
    additionalActionHandler: {
        canvas: new AsyncSubject(),
        reset: new Subject<void>()
    },
    workerContext: self,
    reflectHandler: (state) => ({
        objects: Object.keys(state.objects).length
    })
} as GameEngineOptions<AppState>;
options.dispose = run(main, {
    GameEngine: makeGameEngineDriver(initState, options)
});
