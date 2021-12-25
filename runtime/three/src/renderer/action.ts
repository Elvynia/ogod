
import { OgodActionActor, ogodActionCreatorActor, OGOD_ACTION_ACTOR } from "@ogod/common";
import { ThreeStateRenderer } from "./default/state";

export function threeActionCreatorRenderer(action: OGOD_ACTION_ACTOR) {
    return ogodActionCreatorActor<OgodActionActor<ThreeStateRenderer>, ThreeStateRenderer>('renderer', action);
}

export const rendererInit = threeActionCreatorRenderer(OGOD_ACTION_ACTOR.INIT);
export const rendererInitSuccess = threeActionCreatorRenderer(OGOD_ACTION_ACTOR.INIT_SUCCESS);
export const rendererInitError = threeActionCreatorRenderer(OGOD_ACTION_ACTOR.INIT_ERROR);

export const rendererChanges = threeActionCreatorRenderer(OGOD_ACTION_ACTOR.CHANGES);
export const rendererChangesSuccess = threeActionCreatorRenderer(OGOD_ACTION_ACTOR.CHANGES_SUCCESS);
export const rendererChangesError = threeActionCreatorRenderer(OGOD_ACTION_ACTOR.CHANGES_ERROR);

export const rendererDestroy = threeActionCreatorRenderer(OGOD_ACTION_ACTOR.DESTROY);
export const rendererDestroySuccess = threeActionCreatorRenderer(OGOD_ACTION_ACTOR.DESTROY_SUCCESS);
export const rendererDestroyError = threeActionCreatorRenderer(OGOD_ACTION_ACTOR.DESTROY_ERROR);
