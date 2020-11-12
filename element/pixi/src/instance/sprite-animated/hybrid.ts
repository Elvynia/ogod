import { PixiElementSpriteAnimated } from './element';
import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function pixiHybridSpriteAnimated(): Hybrids<PixiElementSpriteAnimated> {
    return {
        animation: ogodFactoryInstanceProperty(''),
        playing: ogodFactoryInstanceProperty(false),
        loop: ogodFactoryInstanceProperty(false),
        duration: ogodFactoryInstanceProperty(1),
        durations: ogodFactoryInstanceProperty(undefined)
    };
}
