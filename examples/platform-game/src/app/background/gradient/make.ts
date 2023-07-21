import { distinctState } from "@ogod/core";
import { FeatureKey } from "@ogod/driver-engine";
import { concat, filter, first, map, of, switchMap, withLatestFrom } from "rxjs";
import { PHASE } from "../../phase/state";
import { AppState, WorkerSources } from "../../state";
import { Background } from "../state";
import { BackgroundGradient } from "./state";

export function makeBackgroundGradient(ctx: OffscreenCanvasRenderingContext2D, rect: Omit<BackgroundGradient, 'color'>, colors: string[]) {
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
    return makeBackgroundGradient(ctx, {
        x: 0,
        y: 0,
        x1,
        y1: 0,
        x2: x1 + colors.length * colorWidth,
        y2: 0,
        width: ctx.canvas.width,
        height: ctx.canvas.height
    }, colors);
}

export function makeFeatureBackgroundGradient(sources: WorkerSources): FeatureKey<Background, 'gradient'> {
    return {
        key: 'gradient',
        value$: sources.Engine.state$.pipe(
            filter((s) => s.background?.colors && s.phase > PHASE.SPLASH),
            first(),
            switchMap(() => sources.Engine.state$.pipe(
                distinctState((state) => state.background.baseColor + state.camera.width + state.map.width),
                withLatestFrom(sources.Engine.target$),
                switchMap(([state, canvas]) => {
                    const ctx = canvas.getContext('2d');
                    const colorWidth = Math.round(state.map.width / state.background.colors.length);
                    return concat(
                        of(updateBackground(state, ctx, colorWidth)),
                        sources.Engine.engine$.pipe(
                            filter(() => state.camera.x !== state.background.lastPos),
                            map(() => updateBackground(state, ctx, colorWidth))
                        )
                    );
                })
            ))
        )
    };
}
