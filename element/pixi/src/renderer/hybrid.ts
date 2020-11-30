import { PixiElementRenderer } from './element';
import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceBoolean, ogodFactorySceneProperty } from '@ogod/element-core';

export function pixiHybridRenderer(): Hybrids<PixiElementRenderer> {
    return {
        category: 'renderer',
        transparent: ogodFactoryInstanceBoolean(false),
        width: ogodFactorySceneProperty(800),
        height: ogodFactorySceneProperty(600),
        autoDensity: ogodFactoryInstanceBoolean(false),
        antialias: ogodFactoryInstanceBoolean(false),
        resolution: ogodFactorySceneProperty(1),
        clearBeforeRender: ogodFactoryInstanceBoolean(true),
        preserveDrawingBuffer: ogodFactoryInstanceBoolean(false),
        backgroundColor: ogodFactorySceneProperty(0xdadada),
        powerPreference: ogodFactorySceneProperty(undefined)
    };
}
