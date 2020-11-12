import { define } from 'hybrids';
import { OgodElementRouter } from "./element";
import { ogodHybridRouter } from './hybrid';

export function ogodDefineRouter(): hybrids.HybridElement<OgodElementRouter> {
    return define('ogod-router', ogodHybridRouter());
}
