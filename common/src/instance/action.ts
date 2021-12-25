import { OGOD_CATEGORY } from '../util/category';
import { ogodActionCreator, ogodActionName } from '../util/action';
import { OgodActionActor, ogodActionCreatorActor, OGOD_ACTION_ACTOR } from './../actor/action';
import { OgodStateInstance } from './state';
import { ogodActionCreatorReactive, OGOD_ACTION_REACTIVE } from '../reactive/action';

export interface OgodActionInstance extends OgodActionActor<OgodStateInstance, OGOD_CATEGORY.INSTANCE> { };

export function ogodActionCreatorInstance(action: OGOD_ACTION_ACTOR) {
    return ogodActionCreatorActor<OgodActionInstance, OgodStateInstance>(OGOD_CATEGORY.INSTANCE, action);
}

export const instanceInit = ogodActionCreatorInstance(OGOD_ACTION_ACTOR.INIT);
export const instanceInitSuccess = ogodActionCreatorInstance(OGOD_ACTION_ACTOR.INIT_SUCCESS);
export const instanceInitError = ogodActionCreatorInstance(OGOD_ACTION_ACTOR.INIT_ERROR);

export const instanceChanges = ogodActionCreatorInstance(OGOD_ACTION_ACTOR.CHANGES);
export const instanceChangesSuccess = ogodActionCreatorInstance(OGOD_ACTION_ACTOR.CHANGES_SUCCESS);
export const instanceChangesError = ogodActionCreatorInstance(OGOD_ACTION_ACTOR.CHANGES_ERROR);

export const instanceStart = ogodActionCreatorReactive<{ id: string, state: OgodStateInstance }>(
    OGOD_CATEGORY.INSTANCE, OGOD_ACTION_REACTIVE.START);
export const instanceStop = ogodActionCreatorReactive<{ id: string, state: OgodStateInstance }>(
    OGOD_CATEGORY.INSTANCE, OGOD_ACTION_REACTIVE.STOP);

// FIXME: refactor into container/action
export const instanceAdd = ogodActionCreator<{ id: string, sceneId: string }>(
    ogodActionName(OGOD_CATEGORY.INSTANCE, 'ADD'));
export const instanceRemove = ogodActionCreator<{ id: string, sceneId: string }>(
    ogodActionName(OGOD_CATEGORY.INSTANCE, 'REMOVE'));

export const instanceDestroy = ogodActionCreatorInstance(OGOD_ACTION_ACTOR.DESTROY);
export const instanceDestroySuccess = ogodActionCreatorInstance(OGOD_ACTION_ACTOR.DESTROY_SUCCESS);
export const instanceDestroyError = ogodActionCreatorInstance(OGOD_ACTION_ACTOR.DESTROY_ERROR);
