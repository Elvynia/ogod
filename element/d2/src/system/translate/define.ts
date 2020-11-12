import { D2ElementTranslate } from './element';
import { Hybrids } from 'hybrids';
import { ogodDefineSystem } from "@ogod/element-core";
import { d2HybridTranslate } from "./hybrid";

export function d2DefineTranslate(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []): hybrids.HybridElement<D2ElementTranslate> {
    return ogodDefineSystem(tagName || 'd2-translate', [d2HybridTranslate(), ...stateHybrids], overrideHybrids) as hybrids.HybridElement<D2ElementTranslate>;
}
