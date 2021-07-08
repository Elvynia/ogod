import { Hybrids } from 'hybrids';
import { ogodFactoryInstanceBoolean } from '../factory/boolean';
import { OgodElementGroup } from './element';

export function ogodHybridGroup(): Hybrids<OgodElementGroup> {
    return {
        acceptUnloaded: ogodFactoryInstanceBoolean(false)
    };
}
