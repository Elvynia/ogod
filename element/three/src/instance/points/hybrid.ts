import { ogodFactoryInstanceArrayNumber, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { ThreeElementPoints } from './element';

export function threeHybridPoints(): Hybrids<ThreeElementPoints> {
    return {
        // params: ,
        vertices: ogodFactoryInstanceArrayNumber([]),
        resource: ogodFactoryInstanceProperty('')
    }
}
