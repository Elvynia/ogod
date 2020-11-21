import { Hybrids } from 'hybrids';
import { ogodHybridTranslate } from './hybrid';
import { ogodDefineSystem } from '../define';
import { ogodFactorySystemArrayString } from '../../factory/array';

export function ogodDefineTranslate(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    ogodDefineSystem(tagName || 'ogod-translate',
        [ogodHybridTranslate(), ...stateHybrids],
        [{ runtime: 'translate', aspects: ogodFactorySystemArrayString(['tx', 'ty']) }, ...overrideHybrids]
    );
}
