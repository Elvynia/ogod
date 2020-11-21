import { map, filter } from 'rxjs/operators';
import { b2World, b2Vec2 } from '@flyover/box2d';
import { OgodRuntimeSystemDefault, OgodRuntimeEngine } from '@ogod/runtime-core';
import { Box2dStatePhysics } from './state';
import { OgodStateEngine, OgodActionSystem } from '@ogod/common';
import { Observable, from } from 'rxjs';
import { box2dCreateBody } from '../../instance/body/runtime';
import { Box2dStateInstanceBody } from '../../instance/body/state';

declare var self: OgodRuntimeEngine;
export const WORLD_RATIO = 10;
export const WORLD_STEP: number = 1 / 20;
const velocityIterations: number = 8;
const positionIterations: number = 3;

export class Box2dRuntimePhysics extends OgodRuntimeSystemDefault {
    time: number;

    initialize(state: Box2dStatePhysics, state$: Observable<OgodStateEngine>): Observable<OgodActionSystem> {
        this.time = 0;
        state.world$ = new b2World(new b2Vec2(state.gravityX || 0, state.gravityY || 0));
        this.refreshModifiers(state);
        return super.initialize(state, state$);
    }

    add(state: Box2dStatePhysics, instance: Box2dStateInstanceBody) {
        super.add(state, instance);
        instance.body$ = box2dCreateBody(state.world$, instance.body, instance.id);
    }

    remove(state: Box2dStatePhysics, id: string, instance: Box2dStateInstanceBody) {
        state.world$.DestroyBody(instance.body$);
        delete instance.body$;
        super.remove(state, id, instance);
    }

    update(delta: number, state: Box2dStatePhysics) {
        this.time += delta;
        while (this.time >= WORLD_STEP * 1000) {
            this.time -= WORLD_STEP * 1000;
            state.world$.Step(WORLD_STEP, velocityIterations, positionIterations);
        }
        const fullState = self.store.getState();
        from(state.entities).pipe(
            map((id) => fullState.instance[id] as Box2dStateInstanceBody),
            filter((instance) => instance.body.dynamic && !!instance.body$),
        ).subscribe((instance) => {
            instance[state.modifierX] = instance.body$.GetPosition().x * WORLD_RATIO;
            instance[state.modifierY] = instance.body$.GetPosition().y * WORLD_RATIO;
        });
    }

    destroy(state: Box2dStatePhysics) {
        delete state.world$;
        return super.destroy(state);
    }

    refreshModifiers(state: Box2dStatePhysics) {
        if (state.modifier) {
            state.modifierX = state.modifier + (state.modifierX ? state.modifierX[0].toUpperCase() + state.modifierX.substring(1) : 'X');
            state.modifierY = state.modifier + (state.modifierY ? state.modifierY[0].toUpperCase() + state.modifierY.substring(1) : 'Y');
        } else {
            state.modifierX = state.modifierX ? state.modifierX.toLowerCase() : 'x';
            state.modifierY = state.modifierY ? state.modifierY.toLowerCase() : 'y';
        }
    }
}