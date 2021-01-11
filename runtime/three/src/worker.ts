import { ReducersMapObject } from 'redux';
import { OgodRegistry, ogodEpics, ogodReducers, ogodRuntimeEngineDefault, ogodWorkerStream } from '@ogod/runtime-core';
import { Epic } from 'redux-observable';
import { reducerRenderer } from './renderer/reducer';
import { epicRendererInit, epicRendererDestroy, epicRendererChanges } from './renderer/epic';

export const threeWorkerStream = (registry: OgodRegistry, baseHref: string = '/',
    intervalUpdate: number = 1 / 60, reducers: ReducersMapObject = ogodReducers,
    epics: Epic[] = ogodEpics, runtimeEngine = ogodRuntimeEngineDefault) =>
    ogodWorkerStream(registry, baseHref, intervalUpdate, { renderer: reducerRenderer(), ...reducers },
        [epicRendererInit, epicRendererChanges, epicRendererDestroy, ...epics], runtimeEngine);
