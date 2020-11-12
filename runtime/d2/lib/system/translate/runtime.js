"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.D2RuntimeTranslate = void 0;
const runtime_core_1 = require("@ogod/runtime-core");
class D2RuntimeTranslate extends runtime_core_1.OgodRuntimeSystemDefault {
    update(delta, state) {
        const fullState = self.store.getState();
        for (const id of state.entities) {
            const instance = fullState.instance[id];
            if (instance.tx) {
                instance.x = +(instance.x + instance.tx * delta * state.step).toFixed(6);
            }
            if (instance.ty) {
                instance.y = +(instance.y + instance.ty * delta * state.step).toFixed(6);
            }
            if (state.borderMode === 'bounce') {
                this.updateBounce(instance);
            }
            else {
                this.updateInfinite(instance);
            }
        }
    }
    updateInfinite(instance) {
        if (instance.x > self.canvas.width) {
            instance.x %= self.canvas.width;
        }
        else if (instance.x < 0) {
            instance.x = self.canvas.width - instance.x;
        }
        if (instance.y > self.canvas.height) {
            instance.y %= self.canvas.height;
        }
        else if (instance.y < 0) {
            instance.y = self.canvas.height - instance.y;
        }
    }
    updateBounce(instance) {
        const startX = instance.x - this.getWidth(instance) / 2;
        const endX = instance.x + this.getWidth(instance) / 2;
        const startY = instance.y - this.getHeight(instance) / 2;
        const endY = instance.y + this.getHeight(instance) / 2;
        if (instance.tx && endX > self.canvas.width) {
            instance.x -= endX % self.canvas.width;
            instance.tx = -instance.tx;
        }
        else if (instance.tx && startX < 0) {
            instance.x = -startX + this.getWidth(instance) / 2;
            instance.tx = -instance.tx;
        }
        if (instance.ty && endY > self.canvas.height) {
            instance.y -= endY % self.canvas.height;
            instance.ty = -instance.ty;
        }
        else if (instance.ty && startY < 0) {
            instance.y = -startY + this.getHeight(instance) / 2;
            instance.ty = -instance.ty;
        }
    }
    getWidth(instance) {
        return instance.sizeX || instance.size;
    }
    getHeight(instance) {
        return instance.sizeY || instance.size;
    }
}
exports.D2RuntimeTranslate = D2RuntimeTranslate;
//# sourceMappingURL=runtime.js.map