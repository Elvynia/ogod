import { ogodFactoryInstanceChildren, ogodFactoryInstanceProperty } from '@ogod/element-core';

export function threeHybridCamera() {
    return {
        category: 'camera',
        fov: ogodFactoryInstanceProperty(45),
        ratio: ogodFactoryInstanceProperty(0),
        near: ogodFactoryInstanceProperty(1),
        far: ogodFactoryInstanceProperty(1000),
        position: ogodFactoryInstanceChildren('vec3')
    }
}
