import { define } from 'hybrids';
import { OgodElementKey } from "./element";
import { ogodHybridKey } from './hybrid';
import { ogodHybridStateAsync } from '../state/async/hybrid';
import { OgodElementAsync } from '../state/async/element';
import { OgodStateInstance } from '@ogod/common';

export function ogodDefineKey(): hybrids.HybridElement<OgodElementKey & OgodElementAsync<OgodStateInstance>> {
    return define('ogod-key', {
        ...ogodHybridKey(),
        ...ogodHybridStateAsync()
    } as any);
}
