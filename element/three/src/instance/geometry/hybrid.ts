import { ogodFactoryInstanceArrayNumber, ogodFactoryInstanceBoolean } from '@ogod/element-core';
import { ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { ThreeElementGeometry } from './element';

export function threeHybridGeometry(): Hybrids<ThreeElementGeometry> {
    return {
        category: 'geometry',
        type: ogodFactoryInstanceProperty(''),
        buffered: ogodFactoryInstanceBoolean(true),
        args: ogodFactoryInstanceArrayNumber([])
    }
}
