import { define } from 'hybrids';
import { OgodElementInstanceRef } from './element';
import { ogodHybridInstanceRef } from './hybrid';

export function ogodDefineInstanceRef(): hybrids.HybridElement<OgodElementInstanceRef> {
    return define('ogod-instance-ref', ogodHybridInstanceRef());
}
