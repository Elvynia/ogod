"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeWorldSide = void 0;
const runtime_1 = require("../world/runtime");
class PixiRuntimeWorldSide extends runtime_1.PixiRuntimeWorld {
    update(delta, state) {
        super.update(delta, state);
        const fullState = self.store.getState();
        const follow = state.follow ? fullState.instance[state.follow] : null;
        if (follow && state.backgrounds) {
            state.backgrounds.map((id) => fullState.instance[id]).forEach((bg) => {
                bg.speed = -follow.velocity;
            });
        }
    }
}
exports.PixiRuntimeWorldSide = PixiRuntimeWorldSide;
//# sourceMappingURL=runtime.js.map