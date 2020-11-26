import { OgodStore } from '@ogod/common';
import { OgodRuntimeEngine } from '@ogod/runtime-core';
import { D2StateEngine } from './state';

export interface D2RuntimeEngine extends OgodRuntimeEngine {
    store: OgodStore<D2StateEngine>;
}
