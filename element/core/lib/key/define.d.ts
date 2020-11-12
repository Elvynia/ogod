import { OgodElementKey } from "./element";
import { OgodElementAsync } from '../state/async/element';
import { OgodStateInstance } from '@ogod/common';
export declare function ogodDefineKey(): hybrids.HybridElement<OgodElementKey & OgodElementAsync<OgodStateInstance>>;
