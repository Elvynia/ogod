import { PixiStateSpriteAnimated } from '@ogod/runtime-pixi';

export interface PixiStateHero extends PixiStateSpriteAnimated {
    velocity: number;
    grounded: boolean;
    jumping: boolean;
    // keys: OgodStateKeys;
    keys: {
        active: boolean;
        values: Array<{ name: string; pressed: boolean }>;
    };
    speed: number;
    worldX: number;
    worldY: number;
}
