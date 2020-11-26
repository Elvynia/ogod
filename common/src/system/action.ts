import { OGOD_CATEGORY } from '../util/category';
import { ogodActionParams } from '../util/action';
import { OgodActionActor, ogodActionCreatorActor, OGOD_ACTION_ACTOR } from './../actor/action';
import { OgodStateSystem } from './state';

export interface OgodActionSystem extends OgodActionActor<OgodStateSystem, OGOD_CATEGORY.SYSTEM> { };

export const systemInit = ogodActionCreatorActor(OGOD_CATEGORY.SYSTEM, OGOD_ACTION_ACTOR.INIT,
    ogodActionParams<{ id: string, state: OgodStateSystem }>());
export const systemInitSuccess = ogodActionCreatorActor(OGOD_CATEGORY.SYSTEM, OGOD_ACTION_ACTOR.INIT_SUCCESS,
    ogodActionParams<{ id: string, state: OgodStateSystem }>());
export const systemInitError = ogodActionCreatorActor(OGOD_CATEGORY.SYSTEM, OGOD_ACTION_ACTOR.INIT_ERROR,
    ogodActionParams<{ id: string, state: OgodStateSystem }>());

export const systemChanges = ogodActionCreatorActor(OGOD_CATEGORY.SYSTEM, OGOD_ACTION_ACTOR.CHANGES,
    ogodActionParams<{ id: string, changes?: Partial<OgodStateSystem> }>());
export const systemChangesSuccess = ogodActionCreatorActor(OGOD_CATEGORY.SYSTEM, OGOD_ACTION_ACTOR.CHANGES_SUCCESS,
    ogodActionParams<{ id: string, changes?: Partial<OgodStateSystem> }>());
export const systemChangesError = ogodActionCreatorActor(OGOD_CATEGORY.SYSTEM, OGOD_ACTION_ACTOR.CHANGES_ERROR,
    ogodActionParams<{ id: string, changes?: Partial<OgodStateSystem> }>());

export const systemDestroy = ogodActionCreatorActor(OGOD_CATEGORY.SYSTEM, OGOD_ACTION_ACTOR.DESTROY,
    ogodActionParams<{ id: string }>());
export const systemDestroySuccess = ogodActionCreatorActor(OGOD_CATEGORY.SYSTEM, OGOD_ACTION_ACTOR.DESTROY_SUCCESS,
    ogodActionParams<{ id: string }>());
export const systemDestroyError = ogodActionCreatorActor(OGOD_CATEGORY.SYSTEM, OGOD_ACTION_ACTOR.DESTROY_ERROR,
    ogodActionParams<{ id: string }>());
