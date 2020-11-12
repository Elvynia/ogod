import { OgodActionReactive } from './../reactive/action';
import { OGOD_CATEGORY } from '../util/category';
import { ogodActionCreator, ogodActionName, ogodActionParams } from '../util/action';
import { OgodActionActor, ogodActionCreatorActor, OGOD_ACTION_ACTOR } from './../actor/action';
import { OgodStateInstance } from './state';

export interface OgodActionInstance extends OgodActionActor<OgodStateInstance, OGOD_CATEGORY.INSTANCE>,
    OgodActionReactive<OgodStateInstance> { };

export const instanceInit = ogodActionCreatorActor(OGOD_CATEGORY.INSTANCE, OGOD_ACTION_ACTOR.INIT,
    ogodActionParams<{ id: string, state: OgodStateInstance }>());
export const instanceInitSuccess = ogodActionCreatorActor(OGOD_CATEGORY.INSTANCE, OGOD_ACTION_ACTOR.INIT_SUCCESS,
    ogodActionParams<{ id: string, state: OgodStateInstance }>());
export const instanceInitError = ogodActionCreatorActor(OGOD_CATEGORY.INSTANCE, OGOD_ACTION_ACTOR.INIT_ERROR,
    ogodActionParams<{ id: string, state: OgodStateInstance }>());

export const instanceChanges = ogodActionCreatorActor(OGOD_CATEGORY.INSTANCE, OGOD_ACTION_ACTOR.CHANGES,
    ogodActionParams<{ id: string, changes?: Partial<OgodStateInstance> }>());
export const instanceChangesSuccess = ogodActionCreatorActor(OGOD_CATEGORY.INSTANCE, OGOD_ACTION_ACTOR.CHANGES_SUCCESS,
    ogodActionParams<{ id: string, changes?: Partial<OgodStateInstance> }>());
export const instanceChangesError = ogodActionCreatorActor(OGOD_CATEGORY.INSTANCE, OGOD_ACTION_ACTOR.CHANGES_ERROR,
    ogodActionParams<{ id: string, changes?: Partial<OgodStateInstance> }>());

// FIXME: refactor into container/action
export const instanceAdd = ogodActionCreator(ogodActionName(OGOD_CATEGORY.INSTANCE, 'ADD'),
    ogodActionParams<{ id: string, sceneId: string }>());
export const instanceRemove = ogodActionCreator(ogodActionName(OGOD_CATEGORY.INSTANCE, 'REMOVE'),
    ogodActionParams<{ id: string, sceneId: string }>());

export const instanceDestroy = ogodActionCreatorActor(OGOD_CATEGORY.INSTANCE, OGOD_ACTION_ACTOR.DESTROY,
    ogodActionParams<{ id: string }>());
export const instanceDestroySuccess = ogodActionCreatorActor(OGOD_CATEGORY.INSTANCE, OGOD_ACTION_ACTOR.DESTROY_SUCCESS,
    ogodActionParams<{ id: string }>());
export const instanceDestroyError = ogodActionCreatorActor(OGOD_CATEGORY.INSTANCE, OGOD_ACTION_ACTOR.DESTROY_ERROR,
    ogodActionParams<{ id: string }>());
