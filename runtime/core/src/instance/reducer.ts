import {
    OgodStateInstances, OgodActionInstance, instanceInit, instanceInitSuccess, instanceStart, instanceStop,
    instanceDestroySuccess, instanceDestroyError, instanceInitError, instanceChangesSuccess, instanceAdd, instanceRemove, instanceDestroy
} from '@ogod/common';
import { OgodRuntimeEngine } from '../engine/runtime';
import { ogodReducerCreator, ogodReducerOn } from '../util/reducer';

declare var self: OgodRuntimeEngine;

export function ogodReducerInstance(initialState: OgodStateInstances = {}) {
    return ogodReducerCreator<OgodStateInstances, OgodActionInstance>(initialState,
        ogodReducerOn(instanceInit, (state: OgodStateInstances, action) => ({ ...state, [action.id]: {
            ...action.state,
            loading: true
        }})),
        ogodReducerOn(instanceInitSuccess, (state: OgodStateInstances, action) => ({ ...state, [action.id]: {
            ...action.state,
            loading: false,
            loaded: true
        }})),
        ogodReducerOn(instanceChangesSuccess, (state: OgodStateInstances, action) => {
            Object.assign(state[action.id], action.changes);
            return { ...state };
        }),
        ogodReducerOn(instanceAdd, (state: OgodStateInstances, action) => {
            state[action.id].scenes.push(action.sceneId);
            return { ...state };
        }),
        ogodReducerOn(instanceRemove, (state: OgodStateInstances, action) => {
            state[action.id].scenes = state[action.id].scenes.filter((id) => id !== action.sceneId);
            return { ...state };
        }),
        ogodReducerOn(instanceStart, instanceStop, (state: OgodStateInstances, action) => ({ ...state, [action.id]: action.state })),
        ogodReducerOn(instanceDestroy, (state: OgodStateInstances, action) => {
            Object.assign(state[action.id], { destroying: true });
            return { ...state };
        }),
        ogodReducerOn(instanceDestroySuccess, instanceDestroyError, instanceInitError, (state: OgodStateInstances, action) => {
            const { [action.id]: removed, ...states } = state;
            delete self.runtimes.instance[action.id];
            return { ...states };
        })
    );
}
