import { ogodFactoryInstanceChildren, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { ThreeElementMesh } from './element';

export function threeHybridMesh(): Hybrids<ThreeElementMesh> {
    return {
        material: ogodFactoryInstanceChildren('material'),
        geometry: ogodFactoryInstanceChildren('geometry'),
        resource: ogodFactoryInstanceProperty('')
    }
}
