import { ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { ThreeElementMaterial } from './element';

export function threeHybridMaterial(): Hybrids<ThreeElementMaterial> {
    return {
        category: 'material',
        type: ogodFactoryInstanceProperty(''),
        args: ogodFactoryInstanceProperty([])
    }
}
