import { OGOD_CATEGORY } from '../util/category';
import { OgodActionActor, ogodActionCreatorActor, OGOD_ACTION_ACTOR } from './../actor/action';
import { OgodStateSystem } from './state';
import { ogodActionCreatorReactive, OGOD_ACTION_REACTIVE } from '../reactive/action';

export interface OgodActionSystem extends OgodActionActor<OgodStateSystem, OGOD_CATEGORY.SYSTEM> { };

export function ogodActionCreatorSystem(action: OGOD_ACTION_ACTOR) {
    return ogodActionCreatorActor<OgodActionSystem, OgodStateSystem>(OGOD_CATEGORY.SYSTEM, action);
}

export const systemInit = ogodActionCreatorSystem(OGOD_ACTION_ACTOR.INIT);
export const systemInitSuccess = ogodActionCreatorSystem(OGOD_ACTION_ACTOR.INIT_SUCCESS);
export const systemInitError = ogodActionCreatorSystem(OGOD_ACTION_ACTOR.INIT_ERROR);

export const systemChanges = ogodActionCreatorSystem(OGOD_ACTION_ACTOR.CHANGES);
export const systemChangesSuccess = ogodActionCreatorSystem(OGOD_ACTION_ACTOR.CHANGES_SUCCESS);
export const systemChangesError = ogodActionCreatorSystem(OGOD_ACTION_ACTOR.CHANGES_ERROR);

export const systemStart = ogodActionCreatorReactive<{ id: string, state: OgodStateSystem }>(
    OGOD_CATEGORY.SYSTEM, OGOD_ACTION_REACTIVE.START);
export const systemStop = ogodActionCreatorReactive<{ id: string, state: OgodStateSystem }>(
    OGOD_CATEGORY.SYSTEM, OGOD_ACTION_REACTIVE.STOP);

export const systemDestroy = ogodActionCreatorSystem(OGOD_ACTION_ACTOR.DESTROY);
export const systemDestroySuccess = ogodActionCreatorSystem(OGOD_ACTION_ACTOR.DESTROY_SUCCESS);
export const systemDestroyError = ogodActionCreatorSystem(OGOD_ACTION_ACTOR.DESTROY_ERROR);
