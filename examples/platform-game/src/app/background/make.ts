import { makeFeature$ } from '@ogod/game-engine-driver';
import chroma from 'chroma-js';
import { distinctUntilChanged, filter, first, ignoreElements, map, startWith, switchMap, tap, withLatestFrom } from 'rxjs';
import { AppState, WorkerSources } from "../state";
import { randColor } from '../util';
import { Background, BackgroundGradient } from './state';

export function makeBackground(ctx: CanvasRenderingContext2D, rect: Omit<BackgroundGradient, 'color'>, colors: string[]) {
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
        value$: sources.GameEngine.actions.background.pipe(
            startWith(randColor()),
            map((color: string) => {
                return {
                    ...target.background,
                    baseColor: color,
                    colors: chroma.scale([randColor(), randColor(), randColor(), randColor(), randColor()])
                        .mode('lch').colors(50)
                };
            })
        ),
        target
    });
}

function updateBackground(state: AppState, ctx: CanvasRenderingContext2D, colorWidth: number) {
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
            switchMap(([b, state]) => {
                const ctx = sources.GameEngine.canvas.getContext('2d');
                const colorWidth = Math.round(state.gmap.width * state.gmap.scale / state.background.colors.length);
                updateBackground(state, ctx, colorWidth);
                return sources.GameEngine.update$.pipe(
                    filter(() => state.camera.x !== state.background.lastPos),
                    tap(() => updateBackground(state, ctx, colorWidth)),
                    ignoreElements()
                )
            })
        ),
        target
    });
}
