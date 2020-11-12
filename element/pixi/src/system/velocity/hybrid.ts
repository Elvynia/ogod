import { Hybrids } from 'hybrids';
import { PixiElementVelocity } from './element';
import { ogodFactorySystemProperty } from '@ogod/element-core';

export function pixiHybridVelocity(): Hybrids<PixiElementVelocity> {
    return {
        modifier: ogodFactorySystemProperty('default', (host) => {
            if (host.modifier === 'physics') {
                host.aspects = ['velocity', 'body'];
            } else if (host.modifier === 'world') {
                host.aspects = ['velocity', 'worldX'];
            } else {
                host.aspects = ['velocity', 'x'];
            }
            host.mode = 'all';
        })
    }
}
