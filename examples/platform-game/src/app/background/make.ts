import { makeFeature$ } from '@ogod/game-engine-driver';
import * as chroma from 'chroma-js';
import { distinctUntilChanged, filter, ignoreElements, map, startWith, switchMap, tap, withLatestFrom } from 'rxjs';
import { AppState, WorkerSources } from "../state";
import { randColor } from '../util';
import { BackgroundGradient } from './state';

export function makeBackground(ctx: OffscreenCanvasRenderingContext2D, rect: Omit<BackgroundGradient, 'color'>, colors: string[]) {
    const color = ctx.createLinearGradient(rect.x1, rect.y1, rect.x2, rect.y2);
    colors.forEach((c, i) => {
        let pos = i === 0 ? 0 : (i === colors.length - 1 ? 1 : i / colors.length);
        color.addColorStop(pos, c);
    });
    return {
        ...rect,
        color
    };
}

export function makeFeatureBackgroundColors(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'background',
        value$: sources.GameEngine.action$.handlers.background.pipe(
            startWith(randColor()),
            map((color: string) => {
                const ch = chroma(color).lch();
                const colors = [color];
                for (let i = 0; i < 4; ++i) {
                    ch[2] += 50;
                    colors.push(chroma.lch(...ch).hex())
                }
                return {
                    ...target.background,
                    baseColor: color,
                    colors: chroma.scale(colors)
                        .mode('lch').colors(50)
                };
            })
        ),
        target
    });
}

function updateBackground(state: AppState, ctx: OffscreenCanvasRenderingContext2D, colorWidth: number) {
    state.background.lastPos = state.camera.x;
    const colorStart = Math.floor(state.camera.x / colorWidth);
    const posStart = colorStart * colorWidth;
    let colors = [];
    while (colors.length * colorWidth <= ctx.canvas.width + 2 * colorWidth) {
        const index = colorStart + colors.length;
        colors.push(state.background.colors[index >= state.background.colors.length ? state.background.colors.length - 1 : index]);
    }
    const x1 = posStart - state.camera.x;
    state.background.gradients = [makeBackground(ctx, {
        x: 0,
        y: 0,
        x1,
        y1: 0,
        x2: x1 + colors.length * colorWidth,
        y2: 0,
        width: ctx.canvas.width,
        height: ctx.canvas.height
    }, colors)];
}

export function makeFeatureBackgroundUpdate(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'background',
        value$: sources.GameEngine.state$.pipe(
            filter((s) => s.background?.colors && s.phase > 0),
            map((s) => s.background),
            distinctUntilChanged(),
            withLatestFrom(sources.GameEngine.state$),
            withLatestFrom(sources.GameEngine.renderTarget$),
            switchMap(([[b, state], canvas]) => {
                const ctx = canvas.getContext('2d');
                const colorWidth = Math.round(state.gmap.width * state.gmap.scale / state.background.colors.length);
                updateBackground(state, ctx, colorWidth);
                return sources.GameEngine.game$.pipe(
                    filter(() => state.camera.x !== state.background.lastPos),
                    tap(() => updateBackground(state, ctx, colorWidth)),
                    ignoreElements()
                )
            })
        ),
        target
    });
}
