import {
    OgodStateScenes, OgodActionScene, sceneInit, sceneInitSuccess,
    sceneDestroySuccess, sceneDestroyError, sceneInitError, OGOD_CATEGORY, sceneChangesSuccess, sceneChangesCanvas
} from '@ogod/common';
import { OgodRuntimeEngine } from '../engine/runtime';
import { ogodReducerCreator, ogodReducerOn } from '../util/reducer';

declare var self: OgodRuntimeEngine;

export function ogodReducerScene(initialState: OgodStateScenes = {}) {
    return ogodReducerCreator<OgodStateScenes, OgodActionScene>(initialState,
        ogodReducerOn(sceneInit, (states: OgodStateScenes, { id, state }) => ({ ...states, [id]: {
            ...state,
            loading: true
        }})),
        ogodReducerOn(sceneInitSuccess, (states: OgodStateScenes, { id, state }) => ({ ...states, [id]: {
            ...state,
            loading: false,
            loaded: true
        }})),
        ogodReducerOn(sceneChangesSuccess, sceneChangesCanvas, (states: OgodStateScenes, { id, changes }) => {
            Object.assign(states[id], changes);
            return { ...states };
        }),
        ogodReducerOn(sceneDestroySuccess, sceneDestroyError, sceneInitError, (states: OgodStateScenes, { id }) => {
            if (self.runtimes.scene[id]) {
                delete self.runtimes.scene[id];
            }
            const { [id]: removed, ...remaining } = states;
            return { ...remaining };
        })
    );
}
