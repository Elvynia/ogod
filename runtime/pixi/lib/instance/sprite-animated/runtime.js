"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixiRuntimeSpriteAnimated = void 0;
const runtime_1 = require("../default/runtime");
const operators_1 = require("rxjs/operators");
const runtime_2 = require("../sprite/runtime");
class PixiRuntimeSpriteAnimated extends runtime_2.PixiRuntimeSprite {
    initializeSprite(state, state$) {
        return runtime_1.waitForResource(state, state$).pipe(operators_1.map((data) => (Object.assign(Object.assign({}, state), { resource$: data }))), operators_1.map((initState) => (Object.assign(Object.assign({}, initState), { instance$: new PIXI.AnimatedSprite(this.getAnimation(initState), false) }))));
    }
    initializeProperties(state) {
        super.initializeProperties(state);
        this.updateStateLoop(0, state);
        this.updateStateAnimation(0, state);
        this.updateStatePlaying(0, state);
    }
    update(delta, state) {
        if (state.instance$.playing) {
            state.instance$.update(state.duration != null ? delta / (state.duration / state.instance$.textures.length) : 1);
        }
    }
    updateStateLoop(_, state) {
        state.instance$.loop = state.loop;
    }
    updateStateAnimation(_, state) {
        if (state.instance$.playing) {
            state.instance$.stop();
        }
        state.instance$.textures = this.getAnimation(state);
        if (state.playing) {
            state.instance$.play();
        }
    }
    updateStatePlaying(_, state) {
        if (state.playing && !state.instance$.playing) {
            state.instance$.play();
        }
        else if (!state.playing && state.instance$.playing) {
            state.instance$.stop();
        }
    }
    getAnimation(state) {
        const textures = state.resource$.animations[state.animation];
        if (!textures) {
            console.warn('Wrong animation name %s not found in resource %s', state.animation, state.resource);
        }
        if (state.durations != null) {
            if (state.durations.length === textures.length) {
                return textures.map((texture, i) => ({
                    texture,
                    time: state.durations[i]
                }));
            }
            else {
                console.error(`Wrong number of frame durations : ${state.durations.length} (animation has ${textures.length})`);
                // Throw error.
            }
        }
        else {
            return textures;
        }
    }
}
exports.PixiRuntimeSpriteAnimated = PixiRuntimeSpriteAnimated;
//# sourceMappingURL=runtime.js.map