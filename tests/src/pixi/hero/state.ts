import { b2Body } from '@flyover/box2d';
import { PixiStateSpriteAnimated } from '@ogod/runtime-pixi';

export interface PixiStateHero extends PixiStateSpriteAnimated {
    velocityX: number;
    velocityY: number;
    tx: number;
    grounded: boolean;
    jumping: boolean;
    // keys: OgodStateKeys;
    keys: {
        active: boolean;
        values: Array<{ name: string; pressed: boolean }>;
    };
    maxSpeed: number;
    acceleration: number;
    worldX: number;
    worldY: number;
    body$: b2Body;
}
