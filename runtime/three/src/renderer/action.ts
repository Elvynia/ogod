
import { ogodActionCreatorActor, ogodActionParams, OGOD_ACTION_ACTOR } from "@ogod/common";
import { ThreeStateRenderer } from "./default/state";

export const rendererInit = ogodActionCreatorActor('renderer', OGOD_ACTION_ACTOR.INIT,
    ogodActionParams<{ id: string, state: ThreeStateRenderer }>());
export const rendererInitSuccess = ogodActionCreatorActor('renderer', OGOD_ACTION_ACTOR.INIT_SUCCESS,
    ogodActionParams<{ id: string, state: ThreeStateRenderer }>());
export const rendererInitError = ogodActionCreatorActor('renderer', OGOD_ACTION_ACTOR.INIT_ERROR,
    ogodActionParams<{ id: string, state: ThreeStateRenderer }>());

export const rendererChanges = ogodActionCreatorActor('renderer', OGOD_ACTION_ACTOR.CHANGES,
    ogodActionParams<{ id: string, changes?: Partial<ThreeStateRenderer> }>());
export const rendererChangesSuccess = ogodActionCreatorActor('renderer', OGOD_ACTION_ACTOR.CHANGES_SUCCESS,
    ogodActionParams<{ id: string, changes?: Partial<ThreeStateRenderer> }>());
export const rendererChangesError = ogodActionCreatorActor('renderer', OGOD_ACTION_ACTOR.CHANGES_ERROR,
    ogodActionParams<{ id: string, changes?: Partial<ThreeStateRenderer> }>());

export const rendererDestroy = ogodActionCreatorActor('renderer', OGOD_ACTION_ACTOR.DESTROY,
    ogodActionParams<{ id: string }>());
export const rendererDestroySuccess = ogodActionCreatorActor('renderer', OGOD_ACTION_ACTOR.DESTROY_SUCCESS,
    ogodActionParams<{ id: string }>());
export const rendererDestroyError = ogodActionCreatorActor('renderer', OGOD_ACTION_ACTOR.DESTROY_ERROR,
    ogodActionParams<{ id: string }>());
