import { Box2dStateInstanceVelocity } from './../../instance/velocity/state';
import { b2Vec2 } from '@flyover/box2d';
import { OgodRuntimeEngine, OgodRuntimeSystemDefault } from '@ogod/runtime-core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { WORLD_RATIO } from './../physics/runtime';
import { Box2dStateVelocity } from './state';

declare var self: OgodRuntimeEngine;

export class Box2dRuntimeVelocity extends OgodRuntimeSystemDefault {

    update(delta: number, state: Box2dStateVelocity) {
        const fullState = self.store.getState();
        from(state.entities).pipe(
            map((id) => fullState.instance[id] as Box2dStateInstanceVelocity)
        ).subscribe((instance) => {
            // instance.body$.SetLinearVelocity(new b2Vec2(delta * instance.tx / WORLD_RATIO, instance.body$.GetLinearVelocity().y));
            instance.velocityX = instance.body$.GetLinearVelocity().x * WORLD_RATIO;
            instance.velocityY = instance.body$.GetLinearVelocity().y * WORLD_RATIO;
        });
    }
}
