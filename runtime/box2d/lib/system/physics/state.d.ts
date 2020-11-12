import { OgodStateSystem } from '@ogod/common';
import { b2World } from '@flyover/box2d';
export interface Box2dStatePhysics extends OgodStateSystem {
    gravityX: number;
    gravityY: number;
    modifier: string;
    modifierX: string;
    modifierY: string;
    world$: b2World;
}
