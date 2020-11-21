import { OgodRuntimeEngine, OgodRuntimeWorld } from '@ogod/runtime-core';
import { PixiStateWorldSide } from './state';

declare var self: OgodRuntimeEngine;

export class PixiRuntimeWorldSide extends OgodRuntimeWorld {

    update(delta: number, state: PixiStateWorldSide) {
        super.update(delta, state);
        const fullState = self.store.getState();
        const follow: any = state.follow ? fullState.instance[state.follow] : null;
        if (follow && state.backgrounds) {
            state.backgrounds.map((id) => fullState.instance[id]).forEach((bg: any) => {
                // FIXME: should be tx ?
                bg.speed = -follow.velocityX;
            });
        }
    }
}