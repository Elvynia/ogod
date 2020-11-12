import { Hybrids } from 'hybrids';
import { Box2dElementDebug } from './element';
import { ogodFactorySceneBoolean, ogodFactorySceneProperty } from '@ogod/element-core';

export function box2dHybridDebug(): Hybrids<Box2dElementDebug> {
    return {
        draw: ogodFactorySceneBoolean(false),
        physicsId: ogodFactorySceneProperty('')
    };
}
