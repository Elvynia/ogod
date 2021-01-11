import { ogodReducerCreator, ogodReducerOn } from '@ogod/runtime-core';
import { Action } from 'redux';
import { rendererChangesSuccess, rendererDestroyError, rendererDestroySuccess, rendererInitError, rendererInitSuccess } from "./action";
import { ThreeStateRenderer } from './default/state';

export function reducerRenderer(initialState: ThreeStateRenderer = null) {
    return ogodReducerCreator<ThreeStateRenderer, Action>(initialState,
        ogodReducerOn(rendererInitSuccess, (state, action) => action.state),
        ogodReducerOn(rendererChangesSuccess, (state, action) => ({ ...state, ...action.changes })),
        ogodReducerOn(rendererDestroySuccess, rendererDestroyError, rendererInitError, () => null)
    );
}
