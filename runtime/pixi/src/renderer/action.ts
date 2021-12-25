
import { OgodActionActor, ogodActionCreatorActor, OGOD_ACTION_ACTOR } from "@ogod/common";
import { PixiStateRenderer } from "./state";

export function pixiActionCreatorRenderer(action: OGOD_ACTION_ACTOR) {
    return ogodActionCreatorActor<OgodActionActor<PixiStateRenderer>, PixiStateRenderer>('renderer', action);
}

export const rendererInit = pixiActionCreatorRenderer(OGOD_ACTION_ACTOR.INIT);
export const rendererInitSuccess = pixiActionCreatorRenderer(OGOD_ACTION_ACTOR.INIT_SUCCESS);
export const rendererInitError = pixiActionCreatorRenderer(OGOD_ACTION_ACTOR.INIT_ERROR);

export const rendererChanges = pixiActionCreatorRenderer(OGOD_ACTION_ACTOR.CHANGES);
export const rendererChangesSuccess = pixiActionCreatorRenderer(OGOD_ACTION_ACTOR.CHANGES_SUCCESS);
export const rendererChangesError = pixiActionCreatorRenderer(OGOD_ACTION_ACTOR.CHANGES_ERROR);

export const rendererDestroy = pixiActionCreatorRenderer(OGOD_ACTION_ACTOR.DESTROY);
export const rendererDestroySuccess = pixiActionCreatorRenderer(OGOD_ACTION_ACTOR.DESTROY_SUCCESS);
export const rendererDestroyError = pixiActionCreatorRenderer(OGOD_ACTION_ACTOR.DESTROY_ERROR);
