import { makeFeatureConstant } from '@ogod/game-engine-driver';
import { makeRect } from '../rect';
import { Screen } from '../screen/state';
import { WorkerSources } from '../state';

export function makeGrad(ctx: CanvasRenderingContext2D, length: number, middle: number = 0.5) {
    const grad = ctx.createLinearGradient(-length / 2, 0, length / 2, 10);
    grad.addColorStop(0, 'hsla(104, 74%, 39%, 1)');
    grad.addColorStop(middle, 'hsla(180, 100%, 97%, 1)');
    grad.addColorStop(1, 'hsla(263, 58%, 45%, 1)');
    return grad;
}

export function makeFeatureGrounds(sources: WorkerSources, screen: Screen) {
    const ctx = sources.GameEngine.canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 10;
    const yLength = screen.width - 200;
    const xLength = screen.height - 200;
    return makeFeatureConstant('grounds', [
        makeRect({
            x: screen.width / 2,
            y: width / 2,
            width: yLength,
            height: width,
            dynamic: false,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, screen.scale),
        makeRect({
            x: width / 2,
            y: screen.height / 2,
            width: xLength,
            height: width,
            dynamic: false,
            angle: Math.PI / 2,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, screen.scale),
        makeRect({
            x: screen.width - width / 2,
            y: screen.height / 2,
            width: xLength,
            height: width,
            dynamic: false,
            angle: Math.PI / 2,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, screen.scale),
        makeRect({
            x: screen.width / 2,
            y: screen.height - width / 2,
            width: yLength,
            height: width,
            dynamic: false,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, screen.scale)
    ])
}
