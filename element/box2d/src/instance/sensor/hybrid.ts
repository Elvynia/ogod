import { ogodFactoryInstanceChildren, ogodFactoryInstanceProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { Box2dElementInstanceSensors, Box2dElementSensor } from './element';

export function box2dHybridSensor(): Hybrids<Box2dElementSensor> {
    return {
        category: 'sensor',
        id: ogodFactoryInstanceProperty('default'),
        contacts: ogodFactoryInstanceProperty(0),
        shape: ogodFactoryInstanceChildren('shape')
    };
}

export function box2dHybridInstanceSensors(): Hybrids<Box2dElementInstanceSensors> {
    return {
        sensors: ogodFactoryInstanceChildren('sensor', true)
    }
}
