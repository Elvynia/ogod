import { b2Vec2, b2World, b2WeldJointDef } from '@flyover/box2d';
import { Box2dStateContact, WORLD_RATIO } from '@ogod/runtime-box2d';
import { ogodAnimateDistance, ogodAnimateDuration$, OgodRuntimeEngine } from '@ogod/runtime-core';
import { PixiRuntimeSpriteAnimated } from '@ogod/runtime-pixi';
import { Observable } from 'rxjs';
import { map, take, filter, switchMap, switchMapTo, tap } from 'rxjs/operators';
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

const isGroundContact = (contact: Box2dStateContact) => contact.target.id.toLowerCase().includes('level') && contact.normal.y === -1;
const isWallContact = (contact: Box2dStateContact) => contact.target.id.toLowerCase().includes('level') && contact.normal.y === 0;

export class PixiRuntimeHero extends PixiRuntimeSpriteAnimated {
    world: b2World;
    joint: any;

    initialize(state: PixiStateHero, state$: Observable<any>) {
        return state$.pipe(
            filter((fs) => fs.system['physics'] && fs.system['physics'].world$),
            tap((fs) => this.world = fs.system['physics'].world$),
            take(1),
            switchMapTo(super.initialize(state, state$))
        );
    }

    update(delta: number, state: PixiStateHero) {
        if (Object.values(state.contacts).find(isGroundContact)) {
            state.grounded = true;
        } else {
            state.grounded = false;
        }
        const wallContacts = Object.values(state.contacts).filter(isWallContact);
        const wallLeft = wallContacts.find((contact) => contact.normal.x === -1 && contact.normal.y === 0);
        const wallRight = wallContacts.find((contact) => contact.normal.x === 1 && contact.normal.y === 0);
        state.wallLeft = wallLeft != null;
        state.wallRight = wallRight != null;
        if (state.climbing) {
            if (!state.wallLeft && !state.wallRight) {
                state.climbing = false;
                state.body$.SetLinearVelocity(new b2Vec2(10, 0));
            }
        } else {
            if (!state.hanging && (wallLeft && state.tx < 0 && state.sensors.find((sensor) => sensor.id === 'hang_left').contacts === 0
                || wallRight && state.tx > 0 && state.sensors.find((sensor) => sensor.id === 'hang_right').contacts === 0)) {
                state.hanging = wallLeft?.target || wallRight.target;
            } else if (state.tx === 0) {
                state.hanging = null;
            } else if (state.hanging && state.ty > 0) {
                state.hanging = null;
                state.climbing = true;
                this.world.DestroyJoint(this.joint);
                state.body$.SetLinearVelocity(new b2Vec2(0, 10));
            }
        }
        super.update(delta, state);
    }

    updateStateHanging(delta: number, state: PixiStateHero) {
        if (state.hanging && !state.grounded) {
            this.checkAnimation(delta, state);
            const joint = new b2WeldJointDef();
            joint.bodyA = state.body$;
            joint.localAnchorA.Set(1, 2.5);
            joint.bodyB = state.hanging.body$;
            const size = 512 * 0.25 / WORLD_RATIO;
            joint.localAnchorB.Set(0.25 * size, 0.75 * size);
            joint.referenceAngle = 0;
            joint.frequencyHz = 3;
            joint.dampingRatio = 0.1;
            this.joint = this.world.CreateJoint(joint);
            joint.collideConnected = true;
        } else if (this.joint) {
            this.world.DestroyJoint(this.joint);
        }
    }

    updateStateKeys(delta: number, state: PixiStateHero) {
        const left = this.getKeyPressed(state, 'left');
        const right = this.getKeyPressed(state, 'right');
        const jump = this.getKeyPressed(state, 'jump');
        const up = this.getKeyPressed(state, 'up');
        const down = this.getKeyPressed(state, 'down');
        if (right || left) {
            state.tx = right ? state.maxSpeed : -state.maxSpeed;
        } else {
            state.tx = 0;
        }
        if (up || down) {
            state.ty = up ? state.maxSpeed : -state.maxSpeed;
        } else {
            state.ty = 0;
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
            } else if (state.ty < 0) {
                if (state.animation !== 'crouch') {
                    state.animation = 'crouch';
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
        } else if (state.climbing) {
            if (state.animation !== 'corner_climb') {
                state.animation = 'corner_climb';
                this.updateStateAnimation(_, state);
            }
        } else if (state.hanging) {
            if (state.animation !== 'corner_grab') {
                state.animation = 'corner_grab';
                this.updateStateAnimation(_, state);
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
