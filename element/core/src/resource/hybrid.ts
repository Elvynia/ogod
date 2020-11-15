import { map, toArray } from 'rxjs/operators';
import { range } from 'rxjs';
import { OgodElementResource, OgodElementResources } from './element';
import { Hybrids, property } from 'hybrids';

export function ogodHybridResource(): Hybrids<OgodElementResource> {
    return { path: '' };
}

export function ogodHybridResources(): Hybrids<OgodElementResources> {
    return {
        pathPrefix: '',
        pathSuffix: '.png',
        pathStart: 0,
        pathCount: 0,
        paths: property([], (host) => {
            if (host.pathPrefix && host.pathCount) {
                range(host.pathStart, host.pathCount).pipe(
                    map((i) => host.pathPrefix + i + host.pathSuffix),
                    toArray()
                ).subscribe((paths) => host.paths = paths);
            }
        })
    };
}
