"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.D2RuntimeCircle = exports.d2DrawCircle = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
exports.d2DrawCircle = (context, state) => {
    context.beginPath();
    context.arc(state.x, state.y, state.size / 2, 0, 2 * Math.PI);
    context.fill();
};
class D2RuntimeCircle extends runtime_core_1.OgodRuntimeInstanceDefault {
    render(context, state) {
        context.fillStyle = state.color;
        exports.d2DrawCircle(context, state);
    }
}
exports.D2RuntimeCircle = D2RuntimeCircle;
//# sourceMappingURL=runtime.js.map