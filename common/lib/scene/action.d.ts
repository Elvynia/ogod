import { OgodActionActor } from './../actor/action';
import { OGOD_CATEGORY } from '../util/category';
import { OgodStateScene } from './state';
import { OgodActionReactive } from '../reactive/action';
export interface OgodActionScene extends OgodActionActor<OgodStateScene, OGOD_CATEGORY.SCENE>, OgodActionReactive<OgodStateScene> {
}
export declare const sceneInit: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateScene;
}>;
export declare const sceneInitSuccess: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateScene;
}>;
export declare const sceneInitError: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateScene;
}>;
export declare const sceneChanges: import("../util/action").ActionCreator<string, {
    id: string;
    changes: Partial<OgodStateScene>;
}>;
export declare const sceneChangesSuccess: import("../util/action").ActionCreator<string, {
    id: string;
    changes: Partial<OgodStateScene>;
}>;
export declare const sceneChangesError: import("../util/action").ActionCreator<string, {
    id: string;
    changes: Partial<OgodStateScene>;
}>;
export declare const sceneChangesCanvas: import("../util/action").ActionCreator<string, {
    id: string;
    changes?: Partial<OgodStateScene>;
}>;
export declare const sceneDestroy: import("../util/action").ActionCreator<string, {
    id: string;
}>;
export declare const sceneDestroySuccess: import("../util/action").ActionCreator<string, {
    id: string;
}>;
export declare const sceneDestroyError: import("../util/action").ActionCreator<string, {
    id: string;
}>;
