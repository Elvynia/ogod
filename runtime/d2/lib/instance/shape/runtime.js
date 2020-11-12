"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.D2RuntimeShape = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
const runtime_1 = require("../circle/runtime");
const runtime_2 = require("../rect/runtime");
const runtime_3 = require("../square/runtime");
class D2RuntimeShape extends runtime_core_1.OgodRuntimeInstanceDefault {
    render(context, state) {
        context.fillStyle = state.color;
        if (state.angle) {
            context.save();
            context.rotate(state.angle);
        }
        switch (state.type) {
            case 'rect':
                runtime_2.d2DrawRect(context, state);
                break;
            case 'square':
                runtime_3.d2DrawSquare(context, state);
                break;
            case 'circle':
                runtime_1.d2DrawCircle(context, state);
                break;
        }
        if (state.angle) {
            context.restore();
        }
    }
}
exports.D2RuntimeShape = D2RuntimeShape;
//# sourceMappingURL=runtime.js.map