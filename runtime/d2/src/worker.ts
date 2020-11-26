import { epicContextNext } from './context/epic';
import { ReducersMapObject } from 'redux';
import { OgodRegistry, ogodEpics, ogodReducers, ogodRuntimeEngineDefault, ogodWorkerStream } from '@ogod/runtime-core';
import { Epic } from 'redux-observable';
import { reducerContext } from './context/reducer';

export const d2WorkerStream = (registry: OgodRegistry, baseHref: string = '/',
    intervalUpdate: number = 1 / 60, reducers: ReducersMapObject = ogodReducers,
    epics: Epic[] = ogodEpics, runtimeEngine = ogodRuntimeEngineDefault) =>
    ogodWorkerStream(registry, baseHref, intervalUpdate, { context$: reducerContext(), ...reducers }, [epicContextNext, ...epics], runtimeEngine);
