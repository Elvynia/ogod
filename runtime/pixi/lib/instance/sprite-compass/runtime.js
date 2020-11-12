"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeSpriteCompass = void 0;
const runtime_1 = require("../sprite-animated/runtime");
class PixiRuntimeSpriteCompass extends runtime_1.PixiRuntimeSpriteAnimated {
    initialize(state, state$) {
        state.animation = state.animationBase + '/' + state.compass;
        return super.initialize(state, state$);
    }
    initializeProperties(state) {
        super.initializeProperties(state);
        this.checkAnimation(0, state);
    }
    updateStateCompass(_, state) {
        this.checkAnimation(_, state);
    }
    updateStateAnimationBase(_, state) {
        this.checkAnimation(_, state);
    }
    checkAnimation(delta, state) {
        const animation = state.animationBase + '/' + state.compass;
        if (animation !== state.animationBase) {
            state.animation = animation;
            this.updateStateAnimation(delta, state);
        }
    }
}
exports.PixiRuntimeSpriteCompass = PixiRuntimeSpriteCompass;
//# sourceMappingURL=runtime.js.map