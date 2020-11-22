import { b2Body } from '@flyover/box2d';
import { PixiStateSpriteAnimated } from '@ogod/runtime-pixi';
import { Box2dStateInstanceBody, Box2dStateInstanceJump } from '@ogod/runtime-box2d';

export interface PixiStateHero extends PixiStateSpriteAnimated, Box2dStateInstanceBody, Box2dStateInstanceJump {
    velocityX: number;
    velocityY: number;
    tx: number;
    maxSpeed: number;
    worldX: number;
    worldY: number;
    // keys: OgodStateKeys;
    keys: {
        active: boolean;
        values: Array<{ name: string; pressed: boolean }>;
    };
}
