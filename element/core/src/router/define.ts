import { Hybrids } from 'hybrids';
import { ogodDefineElement } from '../define';
import { OgodElementRouter } from "./element";
import { ogodHybridRouter } from './hybrid';

export function ogodDefineRouter(tagName?: string, overrideHybrids?: Hybrids<any>[]): hybrids.HybridElement<OgodElementRouter> {
    return ogodDefineElement(tagName || 'ogod-router', ogodHybridRouter(), [], overrideHybrids);
}
