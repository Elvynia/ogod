import { PixiElementSprite } from './element';
import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function pixiHybridSprite(): Hybrids<PixiElementSprite> {
    return {
        anchor: ogodFactoryInstanceProperty(0)
    };
}
