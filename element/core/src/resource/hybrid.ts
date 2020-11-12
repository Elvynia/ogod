import { OgodElementResource, OgodElementResources } from './element';
import { Hybrids } from 'hybrids';

export function ogodHybridResource(): Hybrids<OgodElementResource> {
    return { path: '' };
}

export function ogodHybridResources(): Hybrids<OgodElementResources> {
    return { paths: '' };
}
