import { ogodFactoryReactiveParent } from '@ogod/element-core';
import { Hybrids } from 'hybrids';
import { PixiElementScene } from './element';
import { ogodFactoryParent } from '@ogod/element-core';

export function pixiHybridScene(): Hybrids<PixiElementScene> {
    return {
        renderer: ogodFactoryReactiveParent('renderer')
    };
}
