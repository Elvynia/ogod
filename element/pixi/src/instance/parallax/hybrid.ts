import { Hybrids } from 'hybrids';
import { PixiElementParallax } from './element';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function pixiHybridParallax(): Hybrids<PixiElementParallax> {
    return {
        width: ogodFactoryInstanceProperty(800),
        height: ogodFactoryInstanceProperty(600),
        speed: ogodFactoryInstanceProperty(0),
        speedFactor: ogodFactoryInstanceProperty(3),
        ratio: ogodFactoryInstanceProperty(1)
    }
}
