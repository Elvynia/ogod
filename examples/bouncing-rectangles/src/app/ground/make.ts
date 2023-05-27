import { FeatureKey } from '@ogod/game-engine-driver';
import { first, map, withLatestFrom } from 'rxjs';
import { waitForCamera } from '../camera/make';
import { Camera } from '../camera/state';
import { makeRect } from '../rect/make';
import { AppState, WorkerSources } from '../state';

export function makeGrad(ctx: OffscreenCanvasRenderingContext2D, length: number, middle: number = 0.5) {
    const grad = ctx.createLinearGradient(-length / 2, 0, length / 2, 10);
    grad.addColorStop(0, 'hsla(104, 74%, 39%, 1)');
    grad.addColorStop(middle, 'hsla(180, 100%, 97%, 1)');
    grad.addColorStop(1, 'hsla(263, 58%, 45%, 1)');
    return grad;
}

export function makeGrounds(sources: WorkerSources, camera: Camera, ctx: OffscreenCanvasRenderingContext2D) {
    const width = 10;
    const yLength = camera.width - 200;
    const xLength = camera.height - 200;
    return [
        makeRect({
            x: camera.width / 2,
            y: width / 2,
            width: yLength,
            height: width,
            dynamic: false,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, camera.scale),
        makeRect({
            x: width / 2,
            y: camera.height / 2,
            width: xLength,
            height: width,
            dynamic: false,
            angle: -Math.PI / 2,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, camera.scale),
        makeRect({
            x: camera.width - width / 2,
            y: camera.height / 2,
            width: xLength,
            height: width,
            dynamic: false,
            angle: -Math.PI / 2,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, camera.scale),
        makeRect({
            x: camera.width / 2,
            y: camera.height - width / 2,
            width: yLength,
            height: width,
            dynamic: false,
            color: makeGrad(ctx, yLength)
        }, sources.World.instance, camera.scale)
    ];
}

export function makeFeatureGrounds(sources: WorkerSources): FeatureKey<AppState, 'grounds'> {
    return {
        key: 'grounds',
        publishOnCreate: true,
        value$: waitForCamera(sources).pipe(
            withLatestFrom(sources.GameEngine.renderTarget$),
            first(),
            map(([state, canvas]) => makeGrounds(sources, state.camera, canvas.getContext('2d')))
        )
    }
}
