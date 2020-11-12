import { OgodRuntimeEngine, OgodRuntimeSystemDefault } from '@ogod/runtime-core';
import { D2StateShape } from '../../instance/shape/state';
import { D2StateTranslate } from './state';

declare var self: OgodRuntimeEngine;

export class D2RuntimeTranslate extends OgodRuntimeSystemDefault {

    update(delta: number, state: D2StateTranslate) {
        const fullState = self.store.getState();
        for (const id of state.entities) {
            const instance = fullState.instance[id] as any;
            if (instance.tx) {
                instance.x = +(instance.x + instance.tx * delta * state.step).toFixed(6);
            }
            if (instance.ty) {
                instance.y = +(instance.y + instance.ty * delta * state.step).toFixed(6);
            }
            if (state.borderMode === 'bounce') {
                this.updateBounce(instance);
            } else {
                this.updateInfinite(instance);
            }
        }
    }

    updateInfinite(instance: D2StateShape) {
        if (instance.x > self.canvas.width) {
            instance.x %= self.canvas.width;
        } else if (instance.x < 0) {
            instance.x = self.canvas.width - instance.x;
        }
        if (instance.y > self.canvas.height) {
            instance.y %= self.canvas.height;
        } else if (instance.y < 0) {
            instance.y = self.canvas.height - instance.y;
        }
    }

    updateBounce(instance: D2StateShape) {
        const startX = instance.x - this.getWidth(instance) / 2;
        const endX = instance.x + this.getWidth(instance) / 2;
        const startY = instance.y - this.getHeight(instance) / 2;
        const endY = instance.y + this.getHeight(instance) / 2;
        if (instance.tx && endX > self.canvas.width) {
            instance.x -= endX % self.canvas.width;
            instance.tx = -instance.tx;
        } else if (instance.tx && startX < 0) {
            instance.x = -startX + this.getWidth(instance) / 2;
            instance.tx = -instance.tx;
        }
        if (instance.ty && endY > self.canvas.height) {
            instance.y -= endY % self.canvas.height;
            instance.ty = -instance.ty;
        } else if (instance.ty && startY < 0) {
            instance.y = -startY + this.getHeight(instance) / 2;
            instance.ty = -instance.ty;
        }
    }

    getWidth(instance: D2StateShape) {
        return instance.sizeX || instance.size;
    }

    getHeight(instance: D2StateShape) {
        return instance.sizeY || instance.size;
    }
}
