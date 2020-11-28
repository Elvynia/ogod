import { Box2dStateInstanceBody } from '@ogod/runtime-box2d';
import { PixiStateSpriteAnimated } from '@ogod/runtime-pixi';

export interface PixiStateHero extends PixiStateSpriteAnimated, Box2dStateInstanceBody {
    grounded: boolean;
    jumping: boolean;
    hanging: boolean;
    velocityX: number;
    velocityY: number;
    tx: number;
    ty: number;
    maxSpeed: number;
    worldX: number;
    worldY: number;
    // keys: OgodStateKeys;
    keys: {
        active: boolean;
        values: Array<{ name: string; pressed: boolean }>;
    };
}
