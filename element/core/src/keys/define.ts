import { define } from 'hybrids';
import { OgodElementKeys } from "./element";
import { ogodHybridKeys } from './hybrid';
import { ogodHybridStateAsync } from '../state/async/hybrid';
import { OgodElementAsync } from '../state/async/element';
import { OgodStateInstance } from '@ogod/common';

export function ogodDefineKeys(): hybrids.HybridElement<OgodElementKeys & OgodElementAsync<OgodStateInstance>> {
    return define('ogod-keys', {
        ...ogodHybridKeys(),
        ...ogodHybridStateAsync()
    } as any);
}
