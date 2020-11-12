import { PixiElementInstance } from './element';
import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function pixiHybridInstance(): Hybrids<PixiElementInstance> {
    return {
        x: ogodFactoryInstanceProperty(0),
        y: ogodFactoryInstanceProperty(0),
        scaleX: ogodFactoryInstanceProperty(1),
        scaleY: ogodFactoryInstanceProperty(1),
        rotation: ogodFactoryInstanceProperty(0),
        index: ogodFactoryInstanceProperty(0),
        resource: ogodFactoryInstanceProperty('')
    };
}
