import { OgodRuntimeSystemDefault, OgodRuntimeEngine } from "@ogod/runtime-core";
import { PixiStateVelocity } from "./state";
import { from } from "rxjs";
import { map } from "rxjs/operators";

declare var self: OgodRuntimeEngine;

const defaultModifier = (delta: number) => (instance) => {
    instance.instance$.position.x += instance.velocity * delta / 1000;
}

const worldModifier = (delta: number) => (instance) => {
    instance.worldX += instance.velocity * delta / 1000;
}

const physicsModifider = (delta: number) => (instance) => {
    if (instance.body$) {
        instance.body$.SetLinearVelocity({
            x: instance.velocity,
            y: instance.body$.GetLinearVelocity().y
        });
    }
};

export class PixiRuntimeVelocity extends OgodRuntimeSystemDefault {

    update(delta: number, state: PixiStateVelocity) {
        const fullState = self.store.getState();
        from(state.entities).pipe(
            map((id) => fullState.instance[id] as any)
        ).subscribe(this.getModifier(state)(delta));
    }

    protected getModifier(state: PixiStateVelocity): (delta: number) => (instance) => void {
        let modifier;
        switch(state.modifier) {
            case 'world':
                modifier = worldModifier;
                break;
            case 'physics':
                modifier = physicsModifider;
                break;
            default:
                modifier = defaultModifier;
        }
        return modifier;
    }
}
