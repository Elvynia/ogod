import { epicSystemInit, epicSystemChanges, epicSystemDestroy } from './system/epic';
import { epicSceneInit, epicSceneChanges, epicSceneDestroy } from './scene/epic';
import { epicResourceInit, epicResourceDestroy } from './resource/epic';
import { epicInstanceInit, epicInstanceChanges, epicInstanceDestroy } from './instance/epic';
import { OgodStateEngine } from '@ogod/common';
import { Epic } from 'redux-observable';
import { epicEngineReflectChanges } from './engine/epic';

export const ogodEpics: Epic<any, any, OgodStateEngine>[] = [
    epicInstanceInit,
    epicInstanceChanges,
    epicInstanceDestroy,
    epicResourceInit,
    epicResourceDestroy,
    epicSceneInit,
    epicSceneChanges,
    epicSceneDestroy,
    epicSystemInit,
    epicSystemChanges,
    epicSystemDestroy,
    epicEngineReflectChanges
];
