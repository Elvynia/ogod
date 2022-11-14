import { isEngineActionCanvas } from '@ogod/game-core';
import { makeFeature$ } from '@ogod/game-engine-driver';
import { filter, map, switchMap, throttleTime, withLatestFrom } from 'rxjs';
import { AppState, WorkerSources } from '../state';
import { NoiseView } from './state';

export function makeNoiseViewCreator(ctx: CanvasRenderingContext2D) {
    return (nextRandFn, x: number, y: number, size: number, scale: number = 1, offset: number = 0) => {
        const data = ctx.createImageData(size, size);
        const buffer = new Uint32Array(data.data.buffer);
        for (let i = 0; i < buffer.length; ++i) {
            const n = nextRandFn(offset + (i % size) * scale, offset + Math.floor(i / size) * scale);
            buffer[i] = 4278190080;
            if (n > 0) {
                buffer[i] += n * 255;
            } else {
                buffer[i] += -n * 255 * 255;
            }
        }
        return {
            x,
            y,
            size,
            data
        } as NoiseView;
    }
}

export function makeFeatureNoises(sources: WorkerSources, target: AppState) {
    const throttle = 50;
    const gap = 25;
    const size = 200;
    return makeFeature$({
        key: 'noises',
        value$: sources.GameEngine.actions.engine.pipe(
            filter(isEngineActionCanvas),
            switchMap(({ payload }) => {
                const ctx: CanvasRenderingContext2D = payload.getContext('2d');
                const makeNoiseView = makeNoiseViewCreator(ctx);
                return sources.GameEngine.update$.pipe(
                    throttleTime(throttle),
                    withLatestFrom(sources.GameEngine.state$),
                    map(([_, state]) => {
                        const cols = Math.floor((ctx.canvas.width - gap) / (size + gap));
                        return state.sources.map((ns, i) => {
                            let x = (size + gap) * (i % cols) + gap;
                            let y = Math.floor(((size + gap) * (i + 1)) / (ctx.canvas.width - gap));
                            y = y * size + gap * (y + 1);
                            return makeNoiseView(ns.generator(), x, y, size, ns.scale, ns.offset());
                        });
                    })
                )
            })
        ),
        target
    });
}
