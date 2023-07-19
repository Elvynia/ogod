import { FeatureKey } from '@ogod/driver-engine';
import { filter, first, map, switchMap, throttleTime } from 'rxjs';
import { AppState, WorkerSources } from '../state';

const OpaqueColor = 0xff000000;

export function makeNoiseViewCreator(ctx: OffscreenCanvasRenderingContext2D) {
    return (nextRandFn, scale: number = 1, offset: number = 0) => {
        const data = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        const buffer = new Uint32Array(data.data.buffer);
        for (let i = 0; i < buffer.length; ++i) {
            const n = nextRandFn(offset + (i % ctx.canvas.width) * scale, offset + Math.floor(i / ctx.canvas.width) * scale);
            if (n > 0) {
                buffer[i] = OpaqueColor + 64 + n * (255 - 64);
            } else {
                const c =  Math.round(64 - n * (255 - 64));
                buffer[i] = OpaqueColor + 256 * c;
            }
        }
        return data;
    }
}

export function makeFeatureData(sources: WorkerSources): FeatureKey<AppState, 'data'> {
    const throttle = 50;
    return {
        key: 'data',
        publishOnNext: true,
        value$: sources.Engine.target$.pipe(
            switchMap((canvas) => {
                const makeNoiseView = makeNoiseViewCreator(canvas.getContext('2d'));
                return sources.Engine.state$.pipe(
                    filter((s) => s.scale && s.offset && !!s.generator),
                    first(),
                    switchMap((state) => sources.Engine.engine$.pipe(
                        throttleTime(throttle),
                        map(() => makeNoiseView(state.generator(), state.scale, state.offset()))
                    ))
                )
            })
        )
    };
}
