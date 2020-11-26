import { PixiStateEngine } from './state';
import { OgodRuntimeEngine } from '@ogod/runtime-core';
import { OgodStore } from '@ogod/common';

export interface PixiRuntimeEngine extends OgodRuntimeEngine {
    store: OgodStore<PixiStateEngine>;
}
