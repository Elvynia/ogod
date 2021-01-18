import { ogodFactoryReactiveBoolean, ogodFactoryReactiveProperty } from '@ogod/element-core';
import { rendererChanges } from '@ogod/runtime-pixi';
import { Hybrids } from 'hybrids';
import { PixiElementRenderer } from './element';

export function pixiHybridRenderer(): Hybrids<PixiElementRenderer> {
    return {
        category: 'renderer',
        transparent: ogodFactoryReactiveBoolean(false, rendererChanges),
        width: ogodFactoryReactiveProperty(800, rendererChanges),
        height: ogodFactoryReactiveProperty(600, rendererChanges),
        autoDensity: ogodFactoryReactiveBoolean(false, rendererChanges),
        antialias: ogodFactoryReactiveBoolean(false, rendererChanges),
        resolution: ogodFactoryReactiveProperty(1, rendererChanges),
        clearBeforeRender: ogodFactoryReactiveBoolean(true, rendererChanges),
        preserveDrawingBuffer: ogodFactoryReactiveBoolean(false, rendererChanges),
        backgroundColor: ogodFactoryReactiveProperty(0xdadada, rendererChanges),
        powerPreference: ogodFactoryReactiveProperty(undefined, rendererChanges)
    };
}
