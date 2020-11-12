import { OgodRuntimeEngine } from "@ogod/runtime-core";
import { PixiStateWorldSide } from "./state";
import { PixiRuntimeWorld } from "../world/runtime";

declare var self: OgodRuntimeEngine;

export class PixiRuntimeWorldSide extends PixiRuntimeWorld {

    update(delta: number, state: PixiStateWorldSide) {
        super.update(delta, state);
        const fullState = self.store.getState();
        const follow: any = state.follow ? fullState.instance[state.follow] : null;
        if (follow && state.backgrounds) {
            state.backgrounds.map((id) => fullState.instance[id]).forEach((bg: any) => {
                bg.speed = -follow.velocity;
            });
        }
    }
}