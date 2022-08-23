import run from '@cycle/run';
import { ActionState, GameEngineOptions, GameEngineSource, makeGameEngineDriver, makeGameEngineOptions } from '@ogod/game-engine-driver';
import { gsap } from 'gsap';
import { AsyncSubject, mergeMap, of, startWith, Subject, tap } from 'rxjs';
import { makeRandomBall$ } from './app/ball';
import { makeRender } from './app/render';
import { AppState } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: { GameEngine: GameEngineSource<AppState> }) {
    let offscreen;
    sources.GameEngine.action$['canvas'].subscribe((canvas) => {
        offscreen = canvas;
        const render = makeRender(canvas);
        sources.GameEngine.render$.subscribe(([delta, state]) => render(delta, state));
    });
    const objects = {};
    const randomBall$ = makeRandomBall$(sources.GameEngine.action$['reset'], objects);
    gsap.ticker.remove(gsap.updateRoot);
    sources.GameEngine.frame$.subscribe(({ elapsed }) => gsap.updateRoot(elapsed / 1000));
    return {
        GameEngine: of({
            app: sources.GameEngine.action$.app.pipe(
                tap((app) => {
                    offscreen.width = app.width;
                    offscreen.height = app.height;
                })
            ),
            objects: sources.GameEngine.action$.objects.pipe(
                mergeMap(({ x, y }) => randomBall$(x, y)),
                startWith(objects)
            )
        })
    };
}

let options = {
    ...makeGameEngineOptions<AppState, any>(['app', 'objects', {
        canvas: new AsyncSubject<any>(),
        reset: new Subject<void>()
    } as ActionState<any>]),
    workerContext: self,
    reflectHandler: (state) => ({
        objects: Object.keys(state.objects).length
    })
} as GameEngineOptions<AppState>;
options.dispose = run(main, {
    GameEngine: makeGameEngineDriver(options)
});
