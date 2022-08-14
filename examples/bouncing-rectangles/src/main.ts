import 'symbol-observable';
import { run } from '@cycle/run';
import { makeGameEngineDriver } from '@ogod/game-engine-driver';
import { concat, distinctUntilChanged, map, Observable, of, timer, withLatestFrom } from 'rxjs';

function main(sources) {
    // const keysDownPerFrame$ = makeKeysDownPerFrame(sources.GameEngine.frame$);
    sources.GameEngine.game$.subscribe((state) => {
        console.log('Running with state: ', state);
    });
    return {
        GameEngine: of({
            paused: concat(of(false), timer(500).pipe(
                map(() => ({ spacebar: 'Space' })),
                withLatestFrom(sources.GameEngine.state$ as Observable<any>),
                map(([inputState, gameState]) =>
                    inputState['spacebar'] === 'Space' ? !gameState.paused : gameState.paused
                ),
                distinctUntilChanged()
            ))
        })
    };
}

run(main, {
    GameEngine: makeGameEngineDriver()
});
