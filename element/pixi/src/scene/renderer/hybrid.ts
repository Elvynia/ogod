import { PixiElementRenderer } from './element';
import { Hybrids } from 'hybrids';
import { ogodFactorySceneProperty } from '@ogod/element-core';

export function pixiHybridRenderer(): Hybrids<PixiElementRenderer> {
    return {
        category: 'renderer',
        transparent: ogodFactorySceneProperty(false),
        width: ogodFactorySceneProperty(800),
        height: ogodFactorySceneProperty(600),
        autoDensity: ogodFactorySceneProperty(false),
        antialias: ogodFactorySceneProperty(false),
        resolution: ogodFactorySceneProperty(1),
        clearBeforeRender: ogodFactorySceneProperty(true),
        preserveDrawingBuffer: ogodFactorySceneProperty(false),
        backgroundColor: ogodFactorySceneProperty(0xdadada),
        powerPreference: ogodFactorySceneProperty(undefined)
    };
}
