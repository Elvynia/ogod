import { OGOD_ACTION_ACTOR, ogodActionCreatorActor, OgodActionActor } from './../actor/action';
import { OGOD_CATEGORY } from '../util/category';
import { OgodStateResource } from './state';

export interface OgodActionResource extends OgodActionActor<OgodStateResource, OGOD_CATEGORY.RESOURCE> { };

export function ogodActionCreatorResource(action: OGOD_ACTION_ACTOR) {
    return ogodActionCreatorActor<OgodActionResource, OgodStateResource>(OGOD_CATEGORY.RESOURCE, action);
}

export const resourceInit = ogodActionCreatorResource(OGOD_ACTION_ACTOR.INIT);
export const resourceInitSuccess = ogodActionCreatorResource(OGOD_ACTION_ACTOR.INIT_SUCCESS);
export const resourceInitError = ogodActionCreatorResource(OGOD_ACTION_ACTOR.INIT_ERROR);

export const resourceChanges = ogodActionCreatorResource(OGOD_ACTION_ACTOR.CHANGES);
export const resourceChangesSuccess = ogodActionCreatorResource(OGOD_ACTION_ACTOR.CHANGES_SUCCESS);
export const resourceChangesError = ogodActionCreatorResource(OGOD_ACTION_ACTOR.CHANGES_ERROR);

export const resourceDestroy = ogodActionCreatorResource(OGOD_ACTION_ACTOR.DESTROY);
export const resourceDestroySuccess = ogodActionCreatorResource(OGOD_ACTION_ACTOR.DESTROY_SUCCESS);
export const resourceDestroyError = ogodActionCreatorResource(OGOD_ACTION_ACTOR.DESTROY_ERROR);
