import { ogodReducerCreator, ogodReducerOn } from '@ogod/runtime-core';
import { contextNext } from "./action";
import { Action } from 'redux';

export function reducerContext(initialState: OffscreenCanvasRenderingContext2D = null) {
    return ogodReducerCreator<OffscreenCanvasRenderingContext2D, Action>(initialState,
        ogodReducerOn(contextNext, (state: OffscreenCanvasRenderingContext2D, action) => action.context)
    );
}
