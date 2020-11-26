import { OGOD_ACTION_ACTOR, ogodActionCreatorActor, OgodActionActor } from './../actor/action';
import { OGOD_CATEGORY } from '../util/category';
import { OgodStateResource } from './state';
import { ogodActionParams } from '../util/action';

export interface OgodActionResource extends OgodActionActor<OgodStateResource, OGOD_CATEGORY.RESOURCE> { };

export const resourceInit = ogodActionCreatorActor(OGOD_CATEGORY.RESOURCE, OGOD_ACTION_ACTOR.INIT,
    ogodActionParams<{ id: string, state: OgodStateResource }>());
export const resourceInitSuccess = ogodActionCreatorActor(OGOD_CATEGORY.RESOURCE, OGOD_ACTION_ACTOR.INIT_SUCCESS,
    ogodActionParams<{ id: string, state: OgodStateResource }>());
export const resourceInitError = ogodActionCreatorActor(OGOD_CATEGORY.RESOURCE, OGOD_ACTION_ACTOR.INIT_ERROR,
    ogodActionParams<{ id: string, state: OgodStateResource }>());

export const resourceChanges = ogodActionCreatorActor(OGOD_CATEGORY.RESOURCE, OGOD_ACTION_ACTOR.CHANGES,
    ogodActionParams<{ id: string, changes: Partial<OgodStateResource> }>());
export const resourceChangesSuccess = ogodActionCreatorActor(OGOD_CATEGORY.RESOURCE, OGOD_ACTION_ACTOR.CHANGES_SUCCESS,
    ogodActionParams<{ id: string, changes: Partial<OgodStateResource> }>());
export const resourceChangesError = ogodActionCreatorActor(OGOD_CATEGORY.RESOURCE, OGOD_ACTION_ACTOR.CHANGES_ERROR,
    ogodActionParams<{ id: string, changes: Partial<OgodStateResource> }>());

export const resourceDestroy = ogodActionCreatorActor(OGOD_CATEGORY.RESOURCE, OGOD_ACTION_ACTOR.DESTROY,
    ogodActionParams<{ id: string }>());
export const resourceDestroySuccess = ogodActionCreatorActor(OGOD_CATEGORY.RESOURCE, OGOD_ACTION_ACTOR.DESTROY_SUCCESS,
    ogodActionParams<{ id: string }>());
export const resourceDestroyError = ogodActionCreatorActor(OGOD_CATEGORY.RESOURCE, OGOD_ACTION_ACTOR.DESTROY_ERROR,
    ogodActionParams<{ id: string }>());
