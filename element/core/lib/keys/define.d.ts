import { OgodElementKeys } from "./element";
import { OgodElementAsync } from '../state/async/element';
import { OgodStateInstance } from '@ogod/common';
export declare function ogodDefineKeys(): hybrids.HybridElement<OgodElementKeys & OgodElementAsync<OgodStateInstance>>;
