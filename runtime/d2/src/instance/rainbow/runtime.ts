import { OgodRuntimeInstanceDefault } from '@ogod/runtime-core';
import { D2StateRainbow } from './state';

export class D2RuntimeRainbow extends OgodRuntimeInstanceDefault {

    update(delta: number, state: D2StateRainbow) {
        state.time += delta;
        state.index = Math.round(state.time / 80) % 100;
    }

    render(context: OffscreenCanvasRenderingContext2D, state: D2StateRainbow) {
        let gradient = context.createRadialGradient(state.x, state.y, state.width / 4, state.x, state.y, state.height * 5 / 7);
        gradient.addColorStop(state.step * 0, 'transparent');
        gradient.addColorStop(state.step * 7, state.colors[state.index % state.colors.length]);
        gradient.addColorStop(state.step * 6, state.colors[(state.index + 1) % state.colors.length]);
        gradient.addColorStop(state.step * 5, state.colors[(state.index + 2) % state.colors.length]);
        gradient.addColorStop(state.step * 4, state.colors[(state.index + 3) % state.colors.length])
        gradient.addColorStop(state.step * 3, state.colors[(state.index + 4) % state.colors.length]);
        gradient.addColorStop(state.step * 2, state.colors[(state.index + 5) % state.colors.length]);
        gradient.addColorStop(state.step * 1, state.colors[(state.index + 6) % state.colors.length]);
        gradient.addColorStop(state.step * 8, 'transparent');
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, state.y);
        context.fill();
    }
}
