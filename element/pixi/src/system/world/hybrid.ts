import { Hybrids, html } from 'hybrids';
import { PixiElementWorld } from './element';
import { ogodFactoryInstanceProperty, ogodFactoryInstanceChildren } from '@ogod/element-core';

export function pixiHybridWorld(): Hybrids<PixiElementWorld> {
    return {
        follow: ogodFactoryInstanceProperty(''),
        bounds: ogodFactoryInstanceChildren('area'),
        camera: ogodFactoryInstanceChildren('camera'),
        render: () => html`<slot></slot>`
    };
}
