import { b2BodyType, b2World } from '@box2d/core';
import run from '@cycle/run';
import { GameEngineOptions, GameEngineSource, makeFeatureConstant, makeGameEngineDriver, makeGameEngineOptionsDefault } from '@ogod/game-engine-driver';
import { of } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeFeatureObjects } from './app/objects';
import { makeAddRect, makeParseRect } from './app/rectangle';
import { makeRender } from './app/render';
import { AppState, makeInitState } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

const world = b2World.Create({ x: 0, y: -5 });
const parseRect = makeParseRect(world);
const initState = makeInitState();
const addRect = makeAddRect(initState.app, parseRect);
initState.player = addRect(400, 400, 15, 25);
initState.grounds = [
    addRect(400, 5, 600, 10, b2BodyType.b2_staticBody, 50),
    addRect(5, 300, 400, 10, b2BodyType.b2_staticBody, 50, Math.PI / 2),
    addRect(795, 300, 400, 10, b2BodyType.b2_staticBody, 50, Math.PI / 2),
    addRect(400, 600, 600, 10, b2BodyType.b2_staticBody, 50),
];

function main(sources: { GameEngine: GameEngineSource<AppState> }) {
    sources.GameEngine.update$.subscribe((delta) => {
        world.Step(delta, {
            velocityIterations: 6,
            positionIterations: 2
        });
        initState.player.x = initState.player._body.GetPosition().x * 10;
        initState.player.y = initState.player._body.GetPosition().y * 10;
    });
    sources.GameEngine.action$.select('app').subscribe(({ canvas }) => {
        const render = makeRender(canvas);
        sources.GameEngine.render$.subscribe(([delta, state]) => render(delta, state));
    });
    return {
        GameEngine: of({
            app: makeFeatureConstant(sources.GameEngine, 'app'),
            fps: makeFeatureFps(sources.GameEngine),
            objects: makeFeatureObjects(sources.GameEngine, addRect),
            paused: sources.GameEngine.action$.paused,
            grounds: makeFeatureConstant(sources.GameEngine, 'grounds'),
            player: makeFeatureConstant(sources.GameEngine, 'player')
        })
    };
}

let options = {
    ...makeGameEngineOptionsDefault<AppState>(),
    workerContext: self,
    reflectHandler: ({ fps }) => ({ fps })
} as GameEngineOptions<AppState>
options.dispose = run(main, {
    GameEngine: makeGameEngineDriver(initState, options)
});
