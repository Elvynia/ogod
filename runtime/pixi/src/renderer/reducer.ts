import { ogodReducerCreator, ogodReducerOn } from '@ogod/runtime-core';
import { Action } from 'redux';
import { rendererInitSuccess, rendererInitError, rendererDestroyError, rendererDestroySuccess, rendererChangesSuccess, rendererChanges } from "./action";
import { PixiStateRenderer } from './state';

export function reducerRenderer(initialState: PixiStateRenderer = null) {
    return ogodReducerCreator<PixiStateRenderer, Action>(initialState,
        ogodReducerOn(rendererInitSuccess, (state, action) => action.state),
        ogodReducerOn(rendererChangesSuccess, (state, action) => ({ ...state, ...action.changes })),
        ogodReducerOn(rendererDestroySuccess, rendererDestroyError, rendererInitError, () => null)
    );
}
