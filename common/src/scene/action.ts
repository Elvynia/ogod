import { OGOD_ACTION_ACTOR, ogodActionCreatorActor, OgodActionActor } from './../actor/action';
import { OGOD_CATEGORY } from '../util/category';
import { OgodStateScene } from './state';
import { ogodActionCreator, ogodActionName } from '../util/action';
import { ogodActionCreatorReactive, OGOD_ACTION_REACTIVE } from '../reactive/action';

export interface OgodActionScene extends OgodActionActor<OgodStateScene, OGOD_CATEGORY.SCENE> { };

export function ogodActionCreatorScene(action: OGOD_ACTION_ACTOR) {
    return ogodActionCreatorActor<OgodActionScene, OgodStateScene>(OGOD_CATEGORY.SCENE, action);
}

export const sceneInit = ogodActionCreatorScene(OGOD_ACTION_ACTOR.INIT);
export const sceneInitSuccess = ogodActionCreatorScene(OGOD_ACTION_ACTOR.INIT_SUCCESS);
export const sceneInitError = ogodActionCreatorScene(OGOD_ACTION_ACTOR.INIT_ERROR);

export const sceneChanges = ogodActionCreatorScene(OGOD_ACTION_ACTOR.CHANGES);
export const sceneChangesSuccess = ogodActionCreatorScene(OGOD_ACTION_ACTOR.CHANGES_SUCCESS);
export const sceneChangesError = ogodActionCreatorScene(OGOD_ACTION_ACTOR.CHANGES_ERROR);
export const sceneChangesCanvas = ogodActionCreator<{ id: string, changes?: Partial<OgodStateScene> }>(
    ogodActionName(OGOD_CATEGORY.SCENE, 'CANVAS'));

export const sceneStart = ogodActionCreatorReactive<{ id: string, state: OgodStateScene }>(
    OGOD_CATEGORY.SCENE, OGOD_ACTION_REACTIVE.START);
export const sceneStop = ogodActionCreatorReactive<{ id: string, state: OgodStateScene }>(
    OGOD_CATEGORY.SCENE, OGOD_ACTION_REACTIVE.STOP);

export const sceneDestroy = ogodActionCreatorScene(OGOD_ACTION_ACTOR.DESTROY);
export const sceneDestroySuccess = ogodActionCreatorScene(OGOD_ACTION_ACTOR.DESTROY_SUCCESS);
export const sceneDestroyError = ogodActionCreatorScene(OGOD_ACTION_ACTOR.DESTROY_ERROR);
