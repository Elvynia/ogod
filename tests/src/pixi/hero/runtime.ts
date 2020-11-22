import { b2Vec2 } from '@flyover/box2d';
import { WORLD_RATIO } from '@ogod/runtime-box2d';
import { ogodAnimateDistance, ogodAnimateDuration$, OgodRuntimeEngine } from '@ogod/runtime-core';
import { PixiRuntimeSpriteAnimated } from '@ogod/runtime-pixi';
import { map, distinctUntilChanged, take } from 'rxjs/operators';
import { PixiStateHero } from './state';

declare var self: OgodRuntimeEngine;

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

    // update(delta: number, state: PixiStateHero) {

    //     super.update(delta, state);
    // }

    updateStateKeys(delta: number, state: PixiStateHero) {
        const left = this.getKeyPressed(state, 'left');
        const right = this.getKeyPressed(state, 'right');
        const jump = this.getKeyPressed(state, 'jump');
        if (right || left) {
            state.tx = right ? state.maxSpeed : -state.maxSpeed;
        } else {
            state.tx = 0;
        }
        state.jumping = jump;
        this.checkAnimation(delta, state);
    }

    updateStateTx(_, state: PixiStateHero) {
        if (state.sub$['velocity']) {
            state.sub$['velocity'].unsubscribe();
        }
        if (state.tx !== 0) {
            state.sub$['velocity'] = ogodAnimateDuration$(800).pipe(
                map(sineOut),
                ogodAnimateDistance(state.tx)
            ).subscribe((tx: number) => {
                state.body$.SetLinearVelocity(new b2Vec2(tx / WORLD_RATIO, state.body$.GetLinearVelocity().y));
            });
        } else {
            state.sub$['velocity'] = ogodAnimateDuration$(100).pipe(
                map(sineInOut),
                map((val) => 1 - val),
                ogodAnimateDistance(state.velocityX)
            ).subscribe((tx: number) => {
                state.body$.SetLinearVelocity(new b2Vec2(tx / WORLD_RATIO, state.body$.GetLinearVelocity().y));
            });
        }
    }

    updateStateGrounded(_, state: PixiStateHero) {
        this.checkAnimation(_, state);
    }

    updateStateJumping(_, state: PixiStateHero) {
        if (!state.jumping && state.sub$['jump']) {
            state.sub$['jump'].unsubscribe();
        }
        if (state.jumping && state.grounded) {
            const steps = 20;
            state.sub$['jump'] = self.update$.pipe(
                take(steps)
            ).subscribe((delta: number) => {
                let force = state.body$.GetMass() * 12 / (delta / 1000); //f = mv/t
                force /= steps;
                state.body$.ApplyForce(new b2Vec2(state.body$.GetLinearVelocity().x, force), state.body$.GetWorldCenter());
            });
        }
    }

    updateStateVelocityY(_, state: PixiStateHero) {
        this.checkAnimation(_, state);
    }

    checkAnimation(_, state: PixiStateHero) {
        if (state.tx > 0 && state.scaleX < 0) {
            state.scaleX = -state.scaleX;
            this.updateStateScaleX(_, state);
        } else if (state.tx < 0 && state.scaleX > 0) {
            state.scaleX = -state.scaleX;
            this.updateStateScaleX(_, state);
        }
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
