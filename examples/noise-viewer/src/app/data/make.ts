import { FeatureKey } from '@ogod/game-engine-driver';
import { filter, first, map, switchMap, throttleTime } from 'rxjs';
import { AppState, WorkerSources } from '../state';

export function makeNoiseViewCreator(ctx: OffscreenCanvasRenderingContext2D) {
    return (nextRandFn, x: number, y: number, scale: number = 1, offset: number = 0) => {
        const data = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        const buffer = new Uint32Array(data.data.buffer);
        for (let i = 0; i < buffer.length; ++i) {
            const n = nextRandFn(offset + (i % ctx.canvas.width) * scale, offset + Math.floor(i / ctx.canvas.width) * scale);
            buffer[i] = 4278190080;
            if (n > 0) {
                buffer[i] += n * 255;
            } else {
                buffer[i] += -n * 255 * 255;
            }
        }
        return data;
    }
}

export function makeFeatureData(sources: WorkerSources): FeatureKey<AppState, 'data'> {
    const throttle = 50;
    return {
        key: 'data',
        value$: sources.GameEngine.renderTarget$.pipe(
            switchMap((canvas) => {
                const makeNoiseView = makeNoiseViewCreator(canvas.getContext('2d'));
                return sources.GameEngine.state$.pipe(
                    filter((s) => s.scale && s.offset && !!s.generator),
                    // first(),
                    switchMap((state) => sources.GameEngine.game$.pipe(
                        throttleTime(throttle),
                        map(() => makeNoiseView(state.generator(), 0, 0, state.scale, state.offset()))
                    ))
                )
            })
        )
    };
}
