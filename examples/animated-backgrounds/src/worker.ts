import run from '@cycle/run';
import { GameEngineSource, makeGameEngineDriver, makeGameEngineOptionsDefault } from '@ogod/game-engine-driver';
import { AsyncSubject, mergeMap, of, startWith, Subject, tap, withLatestFrom } from 'rxjs';
import { makeRandomBall$ } from './app/ball';
import { makeRender } from './app/render';
import { AppState, initState } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

function main(sources: { GameEngine: GameEngineSource<AppState> }) {
    const reset$ = (sources.GameEngine.action$ as any).select('reset');
    let offscreen;
    (sources.GameEngine.action$ as any).select('canvas').subscribe((canvas) => {
        offscreen = canvas;
        const render = makeRender(canvas);
        sources.GameEngine.render$.subscribe(([delta, state]) => render(delta, state));
    });
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
                withLatestFrom(sources.GameEngine.state$),
                mergeMap(([{ x, y }, state]) => makeRandomBall$(reset$, state.objects, x, y))
            )
        })
    };
}

let options = makeGameEngineOptionsDefault<AppState>();
options.additionalActionHandler = {
    canvas: new AsyncSubject(),
    reset: new Subject<void>()
};
options.dispose = run(main, {
    GameEngine: makeGameEngineDriver(initState, self, options)
});
