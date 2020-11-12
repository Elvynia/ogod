import { Hybrids } from 'hybrids';
import { PixiElementWorldSide } from './element';
import { ogodFactorySystemArrayString } from '@ogod/element-core';

export function pixiHybridWorldSide(): Hybrids<PixiElementWorldSide> {
    return {
        backgrounds: ogodFactorySystemArrayString()
    };
}
