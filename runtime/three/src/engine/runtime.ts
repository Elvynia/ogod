import { ThreeStateEngine } from './state';
import { OgodRuntimeEngine } from '@ogod/runtime-core';
import { OgodStore } from '@ogod/common';

export interface ThreeRuntimeEngine extends OgodRuntimeEngine {
    store: OgodStore<ThreeStateEngine>;
}
