import {
    OgodStateSystems, OgodActionSystem, systemInit, systemInitSuccess,
    systemDestroySuccess, systemDestroyError, systemInitError, OGOD_CATEGORY, systemChangesSuccess
} from '@ogod/common';
import { OgodRuntimeEngine } from '../engine/runtime';
import { ogodReducerCreator, ogodReducerOn } from '../util/reducer';

declare var self: OgodRuntimeEngine;

export function ogodReducerSystem(initialState: OgodStateSystems = {}) {
    return ogodReducerCreator<OgodStateSystems, OgodActionSystem>(initialState,
        ogodReducerOn(systemInit, (states: OgodStateSystems, { id, state }) => ({ ...states, [id]: {
            ...state,
            loading: true
        }})),
        ogodReducerOn(systemInitSuccess, (states: OgodStateSystems, { id, state }) => ({ ...states, [id]: {
            ...state,
            loading: false,
            loaded: true
        }})),
        ogodReducerOn(systemChangesSuccess, (states: OgodStateSystems, { id, changes }) => {
            Object.assign(states[id], changes);
            return { ...states };
        }),
        ogodReducerOn(systemDestroySuccess, systemDestroyError, systemInitError, (states: OgodStateSystems, { id }) => {
            if (self.runtimes.system[id]) {
                delete self.runtimes.system[id];
            }
            const { [id]: removed, ...remaining } = states;
            return { ...remaining };
        })
    );
}
