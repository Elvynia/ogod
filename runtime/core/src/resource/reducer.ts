import {
    OgodStateResources, OgodActionResource, resourceInit, resourceInitSuccess,
    resourceDestroySuccess, resourceDestroyError, resourceInitError, OGOD_CATEGORY, resourceChangesSuccess
} from '@ogod/common';
import { OgodRuntimeEngine } from '../engine/runtime';
import { ogodReducerCreator, ogodReducerOn } from '../util/reducer';

declare var self: OgodRuntimeEngine;

export function ogodReducerResource(initialState: OgodStateResources = {}) {
    return ogodReducerCreator<OgodStateResources, OgodActionResource>(initialState,
        ogodReducerOn(resourceInit, (states: OgodStateResources, { id, state }) => ({ ...states, [id]: {
            ...state,
            loading: true
        }})),
        ogodReducerOn(resourceInitSuccess, (states: OgodStateResources, { id, state }) => ({ ...states, [id]: {
            ...state,
            loading: false,
            loaded: true
        }})),
        ogodReducerOn(resourceChangesSuccess, (state: OgodStateResources, action) => {
            Object.assign(state[action.id], action.changes);
            return { ...state };
        }),
        ogodReducerOn(resourceDestroySuccess, resourceDestroyError, resourceInitError, (states: OgodStateResources, { id }) => {
            if (self.runtimes.resource[id]) {
                delete self.runtimes.resource[id];
            }
            const { [id]: removed, ...remaining } = states;
            return { ...remaining };
        })
    );
}
