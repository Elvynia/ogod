import { ogodFactoryInstanceProperty } from '@ogod/element-core';

export function threeHybridVec2() {
    return {
        category: 'vec2',
        x: ogodFactoryInstanceProperty(0),
        y: ogodFactoryInstanceProperty(0)
    }
}

export function threeHybridVec3() {
    return {
        ...threeHybridVec2(),
        category: 'vec3',
        z: ogodFactoryInstanceProperty(0)
    }
}
