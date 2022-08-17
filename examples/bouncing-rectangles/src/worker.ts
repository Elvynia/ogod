import run from '@cycle/run';
import { GameEngineSource, makeFeature, makeFeatureConstant, makeGameEngineDriver } from '@ogod/game-engine-driver';
import { of } from 'rxjs';
import { makeFeatureFps } from './app/fps';
import { makeFeatureObjects } from './app/objects';
import { AppState, initState } from './app/state';

declare var self;

const makeRender = (canvas: any) => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    return (delta: number, state: any) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state['objects'].forEach((obj: any) => {
            ctx.fillStyle = obj.color;
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        });
        ctx.fillStyle = state.player.color;
        ctx.fillRect(state.player.position.x, state.player.position.y, 15, 25);
    };
}

function main(sources: { GameEngine: GameEngineSource<AppState> }) {
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
            player: makeFeature(of({
                color: sources.GameEngine.action$.player,
                position: makeFeatureConstant(sources.GameEngine, 'player.position')
            }))
        })
    };
}

const dispose = run(main, {
    GameEngine: makeGameEngineDriver(initState, self)
});
self.onclose = () => dispose();
