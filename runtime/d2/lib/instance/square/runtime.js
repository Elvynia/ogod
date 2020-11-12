"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.D2RuntimeSquare = exports.d2DrawSquare = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
exports.d2DrawSquare = (context, state) => {
    context.fillRect(state.x - state.size / 2, state.y - state.size / 2, state.size, state.size);
};
class D2RuntimeSquare extends runtime_core_1.OgodRuntimeInstanceDefault {
    render(context, state) {
        context.fillStyle = state.color;
        if (state.angle) {
            context.save();
            context.rotate(state.angle);
        }
        exports.d2DrawSquare(context, state);
        if (state.angle) {
            context.restore();
        }
    }
}
exports.D2RuntimeSquare = D2RuntimeSquare;
//# sourceMappingURL=runtime.js.map