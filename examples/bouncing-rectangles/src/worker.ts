import run from '@cycle/run';
import { GameEngineSource, makeFeature, makeFeatureConstant, makeFeatureToggle, makeGameEngineDriver } from '@ogod/game-engine-driver';
import { of } from 'rxjs';
import { makeFeatureObjects } from './app/objects';
import { AppState, initState } from './app/state';

const makeRender = (canvas: any) => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    return (state: any) => {
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
    self.onmessage = (event) => sources.GameEngine.actions.select(event.data.key).next(event.data.value);
    sources.GameEngine.actions.select('app').subscribe(({canvas}) => {
        const render = makeRender(canvas);
        sources.GameEngine.game$.subscribe((state) => render(state));
    });
    return {
        GameEngine: of({
            app: makeFeatureConstant(sources.GameEngine, 'app'),
            objects: makeFeatureObjects(sources.GameEngine),
            paused: makeFeatureToggle(sources.GameEngine, 'paused', sources.GameEngine.actions.select('paused')),
            player: makeFeature(of({
                color: sources.GameEngine.actions.player,
                position: makeFeatureConstant(sources.GameEngine, 'player.position')
            }))
        })
    };
}

const dispose = run(main, {
    GameEngine: makeGameEngineDriver(initState)
});
self.onclose = () => dispose();
