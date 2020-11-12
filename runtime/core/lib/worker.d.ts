import { Epic } from 'redux-observable';
import { ReducersMapObject } from 'redux';
import { ogodRuntimeEngineDefault } from './engine/runtime';
import { OgodRegistry } from './util/registry';
export declare const ogodWorkerStream: (registry: OgodRegistry, baseHref?: string, intervalUpdate?: number, reducers?: ReducersMapObject, epics?: Epic[], runtimeEngine?: typeof ogodRuntimeEngineDefault) => typeof ogodRuntimeEngineDefault;
