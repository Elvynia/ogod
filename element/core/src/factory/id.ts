import { property } from 'hybrids';
import { OgodElementActor } from '../actor/element';

export const ogodFactoryId = () => property('', (host: OgodElementActor<any>) => {
    // FIXME: connect too late for state properties defined before, use getter ?
    if (!host.id) {
        host.id = 'ogod-' + host.category + '-' + host.runtime;
    }
});