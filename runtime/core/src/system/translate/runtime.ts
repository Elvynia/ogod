import { OgodRuntimeSystemDefault } from "../runtime";
import { OgodStateTranslate } from "./state";
import { OgodRuntimeEngine } from "../../engine/runtime";
import { OgodStateTranslatable } from "../../instance/translatable/state";

declare var self: OgodRuntimeEngine;

export class OgodRuntimeTranslate extends OgodRuntimeSystemDefault {

    initialize(state, state$) {
        this.refreshModifiers(state);
        return super.initialize(state, state$);
    }

    update(delta: number, state: OgodStateTranslate) {
        const fullState = self.store.getState();
        for (const id of state.entities) {
            const instance = fullState.instance[id] as any;
            if (instance.tx) {
                instance[state.modifierX] = +(instance[state.modifierX] + instance.tx * delta * state.scale).toFixed(6);
            }
            if (instance.ty) {
                instance[state.modifierY] = +(instance[state.modifierY] + instance.ty * delta * state.scale).toFixed(6);
            }
            if (state.borderMode === 'bounce') {
                this.updateBounce(state, instance);
            } else {
                this.updateInfinite(state, instance);
            }
        }
    }

    updateInfinite(state: OgodStateTranslate, instance: OgodStateTranslatable) {
        if (instance[state.modifierX] > self.canvas.width) {
            instance[state.modifierX] %= self.canvas.width;
        } else if (instance[state.modifierX] < 0) {
            instance[state.modifierX] = self.canvas.width - instance[state.modifierX];
        }
        if (instance[state.modifierY] > self.canvas.height) {
            instance[state.modifierY] %= self.canvas.height;
        } else if (instance[state.modifierY] < 0) {
            instance[state.modifierY] = self.canvas.height - instance[state.modifierY];
        }
    }

    updateBounce(state: OgodStateTranslate, instance: OgodStateTranslatable) {
        const startX = instance[state.modifierX] - instance.width / 2;
        const endX = instance[state.modifierX] + instance.width / 2;
        const startY = instance[state.modifierY] - instance.height / 2;
        const endY = instance[state.modifierY] + instance.height / 2;
        if (instance.tx && endX > self.canvas.width) {
            instance[state.modifierX] -= endX % self.canvas.width;
            instance.tx = -instance.tx;
        } else if (instance.tx && startX < 0) {
            instance[state.modifierX] = -startX + instance.width / 2;
            instance.tx = -instance.tx;
        }
        if (instance.ty && endY > self.canvas.height) {
            instance[state.modifierY] -= endY % self.canvas.height;
            instance.ty = -instance.ty;
        } else if (instance.ty && startY < 0) {
            instance[state.modifierY] = -startY + instance.height / 2;
            instance.ty = -instance.ty;
        }
    }

    refreshModifiers(state: OgodStateTranslate) {
        if (state.modifier) {
            state.modifierX = state.modifier + (state.modifierX ? state.modifierX[0].toUpperCase() + state.modifierX.substring(1) : 'X');
            state.modifierY = state.modifier + (state.modifierY ? state.modifierY[0].toUpperCase() + state.modifierY.substring(1) : 'Y');
        } else {
            state.modifierX = state.modifierX ? state.modifierX.toLowerCase() : 'x';
            state.modifierY = state.modifierY ? state.modifierY.toLowerCase() : 'y';
        }
    }
}
