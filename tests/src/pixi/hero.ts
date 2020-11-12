import { OgodStateEngine, OgodActionInstance } from '@ogod/common';
import { PixiRuntimeSpriteAnimated, PixiStateSpriteAnimated } from '@ogod/runtime-pixi';
import { Observable } from 'rxjs';

interface HeroState extends PixiStateSpriteAnimated {
    velocity: number;
    jumping: boolean;
    // keys: OgodKeysState;
    keys: {
        active: boolean;
        values: Array<{ name: string; pressed: boolean }>;
    };
    speed: number;
    worldX: number;
    worldY: number;
}

export class HeroRuntime extends PixiRuntimeSpriteAnimated {
    velocity: number;
    jumping: boolean;

    initialize(state: HeroState, state$: Observable<OgodStateEngine>): Observable<OgodActionInstance> {
        this.velocity = state.velocity;
        this.jumping = state.jumping;
        state.speed = 10;
        return super.initialize(state, state$);
    }

    updateStateKeys(_, state: HeroState) {
        const left = state.keys.values.find((k) => k.name === 'left').pressed;
        const right = state.keys.values.find((k) => k.name === 'right').pressed;
        const jump = state.keys.values.find((k) => k.name === 'jump').pressed;
        if (right || left) {
            state.velocity = right ? state.speed : -state.speed;
        } else {
            state.velocity = 0;
        }
        state.jumping = jump;
    }
}
