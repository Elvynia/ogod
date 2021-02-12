import { property } from 'hybrids';
import { OgodElementActor } from '../actor/element';

// FIXME: connect too late for state properties defined before, use getter ?
export const ogodFactoryId = () => property('', (host: OgodElementActor<any>) => {
    if (!host.id) {
        host.id = 'ogod-' + host.category + '-' + host.runtime;
    }
});
