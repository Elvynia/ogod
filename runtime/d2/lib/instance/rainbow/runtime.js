"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.D2RuntimeRainbow = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
class D2RuntimeRainbow extends runtime_core_1.OgodRuntimeInstanceDefault {
    update(delta, state) {
        state.time += delta;
        state.index = Math.round(state.time / 80) % 100;
    }
    render(context, state) {
        let gradient = context.createRadialGradient(state.x, state.y, state.width / 4, state.x, state.y, state.height * 5 / 7);
        gradient.addColorStop(state.step * 0, 'transparent');
        gradient.addColorStop(state.step * 7, state.colors[state.index % state.colors.length]);
        gradient.addColorStop(state.step * 6, state.colors[(state.index + 1) % state.colors.length]);
        gradient.addColorStop(state.step * 5, state.colors[(state.index + 2) % state.colors.length]);
        gradient.addColorStop(state.step * 4, state.colors[(state.index + 3) % state.colors.length]);
        gradient.addColorStop(state.step * 3, state.colors[(state.index + 4) % state.colors.length]);
        gradient.addColorStop(state.step * 2, state.colors[(state.index + 5) % state.colors.length]);
        gradient.addColorStop(state.step * 1, state.colors[(state.index + 6) % state.colors.length]);
        gradient.addColorStop(state.step * 8, 'transparent');
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, state.y);
        context.fill();
    }
}
exports.D2RuntimeRainbow = D2RuntimeRainbow;
//# sourceMappingURL=runtime.js.map