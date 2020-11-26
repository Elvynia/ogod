import { OGOD_ACTION_ACTOR, ogodActionCreatorActor, OgodActionActor } from './../actor/action';
import { OGOD_CATEGORY } from '../util/category';
import { OgodStateScene } from './state';
import { ogodActionCreator, ogodActionName, ogodActionParams } from '../util/action';

export interface OgodActionScene extends OgodActionActor<OgodStateScene, OGOD_CATEGORY.SCENE> { };

export const sceneInit = ogodActionCreatorActor(OGOD_CATEGORY.SCENE, OGOD_ACTION_ACTOR.INIT,
    ogodActionParams<{ id: string, state: OgodStateScene }>());
export const sceneInitSuccess = ogodActionCreatorActor(OGOD_CATEGORY.SCENE, OGOD_ACTION_ACTOR.INIT_SUCCESS,
    ogodActionParams<{ id: string, state: OgodStateScene }>());
export const sceneInitError = ogodActionCreatorActor(OGOD_CATEGORY.SCENE, OGOD_ACTION_ACTOR.INIT_ERROR,
    ogodActionParams<{ id: string, state: OgodStateScene }>());

export const sceneChanges = ogodActionCreatorActor(OGOD_CATEGORY.SCENE, OGOD_ACTION_ACTOR.CHANGES,
    ogodActionParams<{ id: string, changes: Partial<OgodStateScene> }>());
export const sceneChangesSuccess = ogodActionCreatorActor(OGOD_CATEGORY.SCENE, OGOD_ACTION_ACTOR.CHANGES_SUCCESS,
    ogodActionParams<{ id: string, changes: Partial<OgodStateScene> }>());
export const sceneChangesError = ogodActionCreatorActor(OGOD_CATEGORY.SCENE, OGOD_ACTION_ACTOR.CHANGES_ERROR,
    ogodActionParams<{ id: string, changes: Partial<OgodStateScene> }>());
export const sceneChangesCanvas = ogodActionCreator(ogodActionName(OGOD_CATEGORY.SCENE, 'CANVAS'),
    ogodActionParams<{ id: string, changes?: Partial<OgodStateScene> }>());

export const sceneDestroy = ogodActionCreatorActor(OGOD_CATEGORY.SCENE, OGOD_ACTION_ACTOR.DESTROY,
    ogodActionParams<{ id: string }>());
export const sceneDestroySuccess = ogodActionCreatorActor(OGOD_CATEGORY.SCENE, OGOD_ACTION_ACTOR.DESTROY_SUCCESS,
    ogodActionParams<{ id: string }>());
export const sceneDestroyError = ogodActionCreatorActor(OGOD_CATEGORY.SCENE, OGOD_ACTION_ACTOR.DESTROY_ERROR,
    ogodActionParams<{ id: string }>());
