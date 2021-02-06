import { ogodFactoryReactiveBoolean, ogodFactoryReactiveProperty } from '@ogod/element-core';
import { rendererChanges } from '@ogod/runtime-three';
import { Hybrids } from 'hybrids';
import { ThreeElementRenderer } from './element';

export function threeHybridRenderer(): Hybrids<ThreeElementRenderer> {
    return {
        category: 'renderer',
        precision: ogodFactoryReactiveProperty('highp', rendererChanges),
        alpha: ogodFactoryReactiveBoolean(false, rendererChanges),
        premultipliedAlpha: ogodFactoryReactiveBoolean(true, rendererChanges),
        antialias: ogodFactoryReactiveBoolean(false, rendererChanges),
        stencil: ogodFactoryReactiveBoolean(true, rendererChanges),
        preserveDrawingBuffer: ogodFactoryReactiveBoolean(false, rendererChanges),
        powerPreference: ogodFactoryReactiveProperty('default', rendererChanges),
        failIfMajorPerformanceCaveat: ogodFactoryReactiveBoolean(false, rendererChanges),
        depth: ogodFactoryReactiveBoolean(true, rendererChanges),
        logarithmicDepthBuffer: ogodFactoryReactiveBoolean(false, rendererChanges),
    }
}
