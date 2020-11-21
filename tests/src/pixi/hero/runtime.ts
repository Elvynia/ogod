import { b2Vec2 } from '@flyover/box2d';
import { WORLD_RATIO } from '@ogod/runtime-box2d';
import { ogodAnimateDistance, ogodAnimateDuration$ } from '@ogod/runtime-core';
import { PixiRuntimeSpriteAnimated } from '@ogod/runtime-pixi';
import { map } from 'rxjs/operators';
import { PixiStateHero } from './state';

// from https://github.com/mattdesl/eases
// which is based on @robpenner's easing functions
const elasticOut = (t) => {
    return Math.sin(-13.0 * (t + 1.0) *
        Math.PI / 2) *
        Math.pow(2.0, -10.0 * t) +
        1.0;
};

function sineInOut(t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1)
}

function sineOut(t) {
    return Math.sin(t * Math.PI / 2)
}

function sineIn(t) {
    var v = Math.cos(t * Math.PI * 0.5)
    if (Math.abs(v) < 1e-14) return 1
    else return 1 - v
}

export class PixiRuntimeHero extends PixiRuntimeSpriteAnimated {
    sub$;

    update(delta: number, state: PixiStateHero) {
        const left = this.getKeyPressed(state, 'left');
        const right = this.getKeyPressed(state, 'right');
        // if (left || right) {
        //     const vel = state.body$.GetLinearVelocity();
        //     let velX = vel.x + delta * state.tx / (WORLD_RATIO * 1000);
        //     if (velX > state.maxSpeed) {
        //         velX = state.maxSpeed;
        //     }
        //     state.body$.SetLinearVelocity(new b2Vec2(velX, vel.y));
        // } else {
        //     state.body$.SetLinearVelocity(new b2Vec2(0, state.body$.GetLinearVelocity().y));
        // }
        super.update(delta, state);
    }

    updateStateKeys(delta: number, state: PixiStateHero) {
        const left = this.getKeyPressed(state, 'left');
        const right = this.getKeyPressed(state, 'right');
        const jump = this.getKeyPressed(state, 'jump');
        if (this.sub$) {
            this.sub$.unsubscribe();
        }
        if (right || left) {
            state.tx = right ? state.maxSpeed : -state.maxSpeed;
            this.sub$ = ogodAnimateDuration$(800).pipe(
                map(sineOut),
                ogodAnimateDistance(state.tx)
            ).subscribe((tx: number) => {
                state.body$.SetLinearVelocity(new b2Vec2(tx / WORLD_RATIO, state.body$.GetLinearVelocity().y));
            });
            if (state.tx > 0 && state.scaleX < 0) {
                state.scaleX = -state.scaleX;
                this.updateStateScaleX(delta, state);
            } else if (state.tx < 0 && state.scaleX > 0) {
                state.scaleX = -state.scaleX;
                this.updateStateScaleX(delta, state);
            }
        } else {
            this.sub$ = ogodAnimateDuration$(100).pipe(
                map(sineOut),
                map((val) => 1 - val),
                ogodAnimateDistance(state.velocityX)
            ).subscribe((tx: number) => {
                state.body$.SetLinearVelocity(new b2Vec2(tx / WORLD_RATIO, state.body$.GetLinearVelocity().y));
            });
            state.tx = 0;
        }
        state.jumping = jump;
        this.checkAnimation(delta, state);
    }

    updateStateGrounded(_, state: PixiStateHero) {
        this.checkAnimation(_, state);
    }

    updateStateVelocityY(_, state: PixiStateHero) {
        this.checkAnimation(_, state);
    }

    checkAnimation(_, state: PixiStateHero) {
        if (state.grounded) {
            if (state.tx !== 0) {
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
        } else if (state.body$.GetLinearVelocity().y > 0) {
            if (state.animation !== 'jump') {
                state.animation = 'jump';
                this.updateStateAnimation(_, state);
                if (state.loop) {
                    state.loop = false;
                    this.updateStateLoop(_, state);
                }
            }
        } else if (state.animation !== 'fall') {
            state.animation = 'fall';
            this.updateStateAnimation(_, state);
            if (!state.loop) {
                state.loop = true;
                this.updateStateLoop(_, state);
            }
        }
    }

    getKeyPressed(state: PixiStateHero, key: string): boolean {
        return state.keys.values.find((k) => k.name === key).pressed;
    }
}
