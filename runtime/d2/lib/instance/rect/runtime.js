"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.D2RuntimeRect = exports.d2DrawRect = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
exports.d2DrawRect = (context, state) => {
    context.fillRect(state.x, state.y, state.sizeX, state.sizeY);
};
class D2RuntimeRect extends runtime_core_1.OgodRuntimeInstanceDefault {
    render(context, state) {
        context.fillStyle = state.color;
        if (state.angle) {
            context.save();
            context.translate(state.x + state.sizeX / 2, state.y + state.sizeY / 2);
            context.rotate(state.angle);
            context.translate(-state.x - state.sizeX / 2, -state.y - state.sizeY / 2);
        }
        exports.d2DrawRect(context, state);
        if (state.angle) {
            context.restore();
        }
    }
}
exports.D2RuntimeRect = D2RuntimeRect;
//# sourceMappingURL=runtime.js.map