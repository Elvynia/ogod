import { ogodActionCreatorActor, OGOD_ACTION_ACTOR } from "../actor/action";
import { ogodActionCreator, ogodActionName } from "../util/action";

export const engineInit = ogodActionCreator<{ id: string, categories: string[] }>(
    ogodActionName('engine', OGOD_ACTION_ACTOR.INIT));
// export const engineInitSuccess = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.INIT_SUCCESS);
// export const engineInitError = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.INIT_ERROR);

export const engineStart = ogodActionCreator(ogodActionName('engine', 'START'));
export const engineStop = ogodActionCreator(ogodActionName('engine', 'STOP'));
export const engineCanvas = ogodActionCreator<{ canvas: OffscreenCanvas }>(ogodActionName('engine', 'CANVAS'));
export const engineCanvasResize = ogodActionCreator<{ width: number, height: number }>(
    ogodActionName('engine', 'CANVAS_RESIZE'));
export const engineReflectChanges = ogodActionCreator<{ states: { id: string, state: any }[] }>(
    ogodActionName('engine', 'REFLECT_CHANGES'));
export const engineReflectUpdates = ogodActionCreator<{ updates: { id: string, state: any }[] }>(
    ogodActionName('engine', 'REFLECT_UPDATES'));

export const engineDestroy = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.DESTROY);
// export const engineDestroySuccess = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.DESTROY_SUCCESS);
// export const engineDestroyError = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.DESTROY_ERROR);
