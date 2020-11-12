import { Hybrids } from 'hybrids';
import { PixiElementCompass } from './element';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function pixiHybridSpriteCompass(): Hybrids<PixiElementCompass> {
    return {
        animationBase: ogodFactoryInstanceProperty(''),
        compass: ogodFactoryInstanceProperty(0)
    };
}
