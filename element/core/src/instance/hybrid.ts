import { OgodElementInstance } from './element';
import { Hybrids } from 'hybrids';
import { ogodFactoryParent } from '../factory/parent';

export function ogodHybridInstance(): Hybrids<OgodElementInstance> {
    return {
        scene: ogodFactoryParent('scene'),
        scenes: (host) => host.scene ? [host.scene.id] : []
    };
}
