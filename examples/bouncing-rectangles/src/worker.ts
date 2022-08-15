import run from '@cycle/run';
import { GameEngineSource, makeGameEngineDriver } from '@ogod/game-engine-driver';
import { initState } from './app/state';

function main(sources: { GameEngine: GameEngineSource<any> }) {

}

const dispose = run(main, {
    GameEngine: makeGameEngineDriver(initState)
});
