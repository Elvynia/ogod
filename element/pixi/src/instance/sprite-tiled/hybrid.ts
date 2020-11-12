import { Hybrids } from 'hybrids';
import { PixiElementSpriteTiled } from './element';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function pixiHybridSpriteTiled(): Hybrids<PixiElementSpriteTiled> {
    return {
        width: ogodFactoryInstanceProperty(800),
        height: ogodFactoryInstanceProperty(600),
        speed: ogodFactoryInstanceProperty(0)
    };
}
