import { OgodRuntimeTranslate } from './system/translate/runtime';
import { OgodRegistry } from './util/registry';
import { OgodRuntimeWorld } from './system/world/runtime';

export const OgodDefaultRegistry: OgodRegistry = {
    'system.world': OgodRuntimeWorld,
    'system.translate': OgodRuntimeTranslate
}
