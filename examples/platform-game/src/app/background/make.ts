import { makeFeatureConstant, makeFeatureObservable } from '@ogod/game-engine-driver';
import { filter, first, ignoreElements, switchMap, tap } from 'rxjs';
import { WorkerSources } from "../state";
import { Background, BackgroundGradient } from './state';
import chroma from 'chroma-js';

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

export function makeFeatureBackgroundCreate() {
    const background = {
        colors: chroma.scale(['#fafa6e','#2A4858', '#c94843', '#2d8daf', '#8effff'])
            .mode('lch').colors(20),
        gradients: []
    } as Background;
    return makeFeatureConstant('background', background);
}

export function makeFeatureBackgroundUpdate(sources: WorkerSources) {
    return makeFeatureObservable('background', sources.GameEngine.state$.pipe(
        filter((s) => s.background && !!s.camera),
        first(),
        switchMap((state) => {
            const background = state.background;
            const ctx = sources.GameEngine.canvas.getContext('2d');
            const colorWidth = Math.round(state.gmap.width * state.gmap.mapScale / background.colors.length);
            return sources.GameEngine.update$.pipe(
                filter(() => state.camera.x !== background.lastPos),
                tap(() => {
                    background.lastPos = state.camera.x;
                    const colorStart = Math.floor(state.camera.x / colorWidth);
                    const posStart = colorStart * colorWidth;
                    let colors = [];
                    while (colors.length * colorWidth <= ctx.canvas.width + 2 * colorWidth) {
                        colors.push(background.colors[colorStart + colors.length]);
                    }
                    const x1 = posStart - state.camera.x;
                    background.gradients = [makeBackground(ctx, {
                        x: 0,
                        y: 0,
                        x1,
                        y1: 0,
                        x2: x1 + colors.length * colorWidth,
                        y2: 0,
                        width: ctx.canvas.width,
                        height: ctx.canvas.height
                    }, colors)];
                }),
                ignoreElements()
            )
        })
    ));
}
