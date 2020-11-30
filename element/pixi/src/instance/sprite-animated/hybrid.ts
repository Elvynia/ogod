import { PixiElementSpriteAnimated } from './element';
import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceBoolean, ogodFactoryInstanceProperty } from '@ogod/element-core';

export function pixiHybridSpriteAnimated(): Hybrids<PixiElementSpriteAnimated> {
    return {
        animation: ogodFactoryInstanceProperty(''),
        playing: ogodFactoryInstanceBoolean(false),
        loop: ogodFactoryInstanceBoolean(false),
        duration: ogodFactoryInstanceProperty(1),
        durations: ogodFactoryInstanceProperty(undefined)
    };
}
