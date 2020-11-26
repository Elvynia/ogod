import { ogodActionCreatorActor, OGOD_ACTION_ACTOR } from "../actor/action";
import { ogodActionCreator, ogodActionName, ogodActionParams } from "../util/action";

export const engineInit = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.INIT,
    ogodActionParams<{ id: string, categories: string[] }>());
// export const engineInitSuccess = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.INIT_SUCCESS);
// export const engineInitError = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.INIT_ERROR);

export const engineStart = ogodActionCreator(ogodActionName('engine', 'START'));
export const engineStop = ogodActionCreator(ogodActionName('engine', 'STOP'));
export const engineCanvas = ogodActionCreator(ogodActionName('engine', 'CANVAS'),
    ogodActionParams<{ canvas: OffscreenCanvas }>());
export const engineReflectChanges = ogodActionCreator(ogodActionName('engine', 'REFLECT_CHANGES'),
    ogodActionParams<{ states: { id: string, state: any }[] }>());
export const engineReflectUpdates = ogodActionCreator(ogodActionName('engine', 'REFLECT_UPDATES'),
    ogodActionParams<{ updates: { id: string, state: any }[] }>());

export const engineDestroy = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.DESTROY);
// export const engineDestroySuccess = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.DESTROY_SUCCESS);
// export const engineDestroyError = ogodActionCreatorActor('engine', OGOD_ACTION_ACTOR.DESTROY_ERROR);
