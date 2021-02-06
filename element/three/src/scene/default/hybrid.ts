import { ogodFactorySceneBoolean, ogodFactorySceneChildren, ogodFactorySceneProperty } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { ThreeElementScene } from './element';

export function threeHybridScene(): Hybrids<ThreeElementScene> {
    return {
        autoUpdate: ogodFactorySceneBoolean(false),
        background: ogodFactorySceneProperty(''),
        camera: ogodFactorySceneChildren('camera')
    }
}
