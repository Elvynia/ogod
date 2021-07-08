import { Hybrids } from 'hybrids';
import { ogodFactoryParent } from '../../factory/parent';
import { OgodElementInGroup } from './element';

export function ogodHybridInGroup(): Hybrids<OgodElementInGroup> {
    return {
        group: ogodFactoryParent('group'),
        groups: (host) => host.group ? [host.group.id] : []
    }
}
