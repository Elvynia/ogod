import { Hybrids } from 'hybrids';
import { OgodElementInWorld } from './element';
import { ogodFactoryInstanceProperty } from '../../factory/property';

export function ogodHybridInWorld(): Hybrids<OgodElementInWorld> {
    return {
        worldX: ogodFactoryInstanceProperty(0),
        worldY: ogodFactoryInstanceProperty(0)
    }
}
