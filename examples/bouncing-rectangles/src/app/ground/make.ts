import { FeatureKey } from '@ogod/driver-engine';
import { first, map, withLatestFrom } from 'rxjs';
import { makeRect } from '../rect/make';
import { AppState, WorkerSources } from '../state';

export function makeGrad(ctx: OffscreenCanvasRenderingContext2D, length: number, middle: number = 0.5) {
    const grad = ctx.createLinearGradient(-length / 2, 0, length / 2, 10);
    grad.addColorStop(0, 'hsla(104, 74%, 39%, 1)');
    grad.addColorStop(middle, 'hsla(180, 100%, 97%, 1)');
    grad.addColorStop(1, 'hsla(263, 58%, 45%, 1)');
    return grad;
}

export function makeGrounds(sources: WorkerSources, state: AppState, canvas: OffscreenCanvas) {
    const ctx = canvas.getContext('2d');
    const width = 10;
    const yLength = canvas.width - 200;
    const xLength = canvas.height - 200;
    return [
        makeRect({
            x: canvas.width / 2,
            y: width / 2,
            width: yLength,
            height: width,
            dynamic: false,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, state.scale),
        makeRect({
            x: width / 2,
            y: canvas.height / 2,
            width: xLength,
            height: width,
            dynamic: false,
            angle: -Math.PI / 2,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, state.scale),
        makeRect({
            x: canvas.width - width / 2,
            y: canvas.height / 2,
            width: xLength,
            height: width,
            dynamic: false,
            angle: -Math.PI / 2,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, state.scale),
        makeRect({
            x: canvas.width / 2,
            y: canvas.height - width / 2,
            width: yLength,
            height: width,
            dynamic: false,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, state.scale)
    ];
}

export function makeFeatureGrounds(sources: WorkerSources): FeatureKey<AppState, 'grounds'> {
    return {
        key: 'grounds',
        publishOnCreate: true,
        value$: sources.Engine.state$.pipe(
            withLatestFrom(sources.Engine.target$),
            first(),
            map(([state, canvas]) => makeGrounds(sources, state, canvas))
        )
    }
}
