import { Hybrids, html } from 'hybrids';
import { OgodElementWorld } from './element';
import { ogodFactoryInstanceProperty } from '../../factory/property';
import { ogodFactoryInstanceChildren } from '../../factory/children';

export function ogodHybridWorld(): Hybrids<OgodElementWorld> {
    return {
        follow: ogodFactoryInstanceProperty(''),
        bounds: ogodFactoryInstanceChildren('area'),
        camera: ogodFactoryInstanceChildren('camera'),
        render: () => html`<slot></slot>`
    };
}
