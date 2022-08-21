import { b2BodyType, b2PolygonShape, b2World } from '@box2d/core';
import run from '@cycle/run';
import { GameEngineSource, makeFeatureConstant, makeGameEngineDriver, makeGameEngineOptionsDefault } from '@ogod/game-engine-driver';
import { of } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeFeatureObjects } from './app/objects';
import { AppState, initState } from './app/state';

declare var self: DedicatedWorkerGlobalScope;

const makeRender = (canvas: any) => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    return (delta: number, state: any) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state['objects'].forEach((obj: any) => {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        });
        ctx.fillStyle = state.player.color;
        ctx.fillRect(state.player.position.x, state.player.position.y, state.player.width, state.player.height);
        ctx.fillStyle = state.ground.color;
        ctx.fillRect(state.ground.position.x, state.ground.position.y, state.ground.width, state.ground.height);
    };
}

function main(sources: { GameEngine: GameEngineSource<AppState> }) {
    const world = b2World.Create({ x: 0, y: -10 });
    const ground = world.CreateBody({
        position: { x: 40, y: 2.5 },
        type: b2BodyType.b2_staticBody
    });
    ground.CreateFixture({
        shape: new b2PolygonShape().SetAsBox(30, 1.25),
        density: 50
    });
    const player = world.CreateBody({
        position: { x: 70.75, y: 20 },
        type: b2BodyType.b2_dynamicBody,
        linearVelocity: { x: 0, y: 0}
    });
    player.CreateFixture({
        shape: new b2PolygonShape().SetAsBox(0.75, 1.25),
        density: 10,
        // restitution: 0.8,
        friction : 0
    });
    sources.GameEngine.update$.subscribe((delta) => {
        world.Step(delta, {
            velocityIterations: 6,
            positionIterations: 2
        });
        // console.log(player.GetPosition())
        initState.player.position.x = player.GetPosition().x * 10;
        initState.player.position.y = 600 - player.GetPosition().y * 10;
    });
    sources.GameEngine.action$.select('app').subscribe(({ canvas }) => {
        const render = makeRender(canvas);
        sources.GameEngine.render$.subscribe(([delta, state]) => render(delta, state));
    });
    return {
        GameEngine: of({
            app: makeFeatureConstant(sources.GameEngine, 'app'),
            fps: makeFeatureFps(sources.GameEngine),
            objects: makeFeatureObjects(sources.GameEngine),
            paused: sources.GameEngine.action$.paused,
            ground: makeFeatureConstant(sources.GameEngine, 'ground'),
            player: makeFeatureConstant(sources.GameEngine, 'player')
        })
    };
}

let options = {
    ...makeGameEngineOptionsDefault<AppState>(),
    workerContext: self
}
options.dispose = run(main, {
    GameEngine: makeGameEngineDriver(initState, options)
});
