import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { PixiRuntimeSpriteAnimated } from '@ogod/runtime-pixi';
import { Observable } from 'rxjs';
import { PixiStateHero } from './state';

export class PixiRuntimeHero extends PixiRuntimeSpriteAnimated {
    velocity: number;
    jumping: boolean;

    initialize(state: PixiStateHero, state$: Observable<OgodStateEngine>): Observable<OgodActionInstance> {
        this.velocity = state.velocity;
        this.jumping = state.jumping;
        state.speed = 10;
        return super.initialize(state, state$);
    }

    updateStateKeys(_, state: PixiStateHero) {
        const left = this.getKeyPressed(state, 'left');
        const right = this.getKeyPressed(state, 'right');
        const jump = this.getKeyPressed(state, 'jump');
        if (right || left) {
            state.velocity = right ? state.speed : -state.speed;
        } else {
            state.velocity = 0;
        }
        state.jumping = jump;
        this.checkAnimation(_, state);
    }

    updateStateGrounded(_, state: PixiStateHero) {
        this.checkAnimation(_, state);
    }

    checkAnimation(_, state: PixiStateHero) {
        if (state.grounded) {
            if (state.velocity > 0 && state.scaleX < 0) {
                state.scaleX = -state.scaleX;
                this.updateStateScaleX(_, state);
            } else if (state.velocity < 0 && state.scaleX > 0) {
                state.scaleX = -state.scaleX;
                this.updateStateScaleX(_, state);
            }
            if (state.velocity !== 0) {
                if (state.animation !== 'run/1') {
                    state.animation = 'run/1';
                    this.updateStateAnimation(_, state);
                }
            } else if (state.animation !== 'idle/1') {
                state.animation = 'idle/1';
                this.updateStateAnimation(_, state);
            }
            if (!state.loop) {
                state.loop = true;
                this.updateStateLoop(_, state);
            }
        } else if (state.animation !== 'jump') {
            state.animation = 'jump';
            this.updateStateAnimation(_, state);
            if (state.loop) {
                state.loop = false;
                this.updateStateLoop(_, state);
            }
        }
    }

    getKeyPressed(state: PixiStateHero, key: string): boolean {
        return state.keys.values.find((k) => k.name === key).pressed;
    }
}
