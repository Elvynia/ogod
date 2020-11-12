import { Hybrids } from 'hybrids';
import { PixiElementParallax } from './element';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function pixiHybridParallax(): Hybrids<PixiElementParallax> {
    return {
        speedFactor: ogodFactoryInstanceProperty(1)
    }
}
