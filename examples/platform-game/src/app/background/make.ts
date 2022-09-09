import { makeFeatureConstant, makeFeatureObservable } from '@ogod/game-engine-driver';
import { filter, first, ignoreElements, switchMap, tap } from 'rxjs';
import { WorkerSources } from "../state";
import { BackgroundGradient } from '../util';
import { Background } from './state';

export function makeBackground(ctx: CanvasRenderingContext2D, rect: Omit<BackgroundGradient, 'color'>, colors: string[]) {
    const color = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.width, rect.y);
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
        colors: ['#c94843', '#b8504f', '#a6575b', '#955f67', '#846773', '#726e7f',
            '#61768b', '#4f7e97', '#3e85a3', '#2d8daf', '#2a97b9', '#35a2c1', '#40aec8',
            '#4bbad0', '#56c5d8', '#61d1e0', '#6ddce8', '#78e8ef', '#83f3f7', '#8effff'],
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
                    const colorStart = state.camera.x > 0 ? Math.floor(state.camera.x / colorWidth) : 0;
                    const posStart = colorStart * colorWidth;
                    let colors = [];
                    while (colors.length * colorWidth <= state.camera.x - posStart + ctx.canvas.width) {
                        colors.push(background.colors[colorStart + colors.length]);
                    }
                    const x = posStart - state.camera.x;
                    background.gradients = [makeBackground(ctx, {
                        x,
                        y: 0,
                        width: colors.length * colorWidth,
                        height: ctx.canvas.height
                    }, colors)];
                }),
                ignoreElements()
            )
        })
    ));
}
