import { OgodActionReactive } from './../reactive/action';
import { OGOD_CATEGORY } from '../util/category';
import { OgodActionActor } from './../actor/action';
import { OgodStateInstance } from './state';
export interface OgodActionInstance extends OgodActionActor<OgodStateInstance, OGOD_CATEGORY.INSTANCE>, OgodActionReactive<OgodStateInstance> {
}
export declare const instanceInit: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateInstance;
}>;
export declare const instanceInitSuccess: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateInstance;
}>;
export declare const instanceInitError: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateInstance;
}>;
export declare const instanceChanges: import("../util/action").ActionCreator<string, {
    id: string;
    changes?: Partial<OgodStateInstance>;
}>;
export declare const instanceChangesSuccess: import("../util/action").ActionCreator<string, {
    id: string;
    changes?: Partial<OgodStateInstance>;
}>;
export declare const instanceChangesError: import("../util/action").ActionCreator<string, {
    id: string;
    changes?: Partial<OgodStateInstance>;
}>;
export declare const instanceAdd: import("../util/action").ActionCreator<string, {
    id: string;
    sceneId: string;
}>;
export declare const instanceRemove: import("../util/action").ActionCreator<string, {
    id: string;
    sceneId: string;
}>;
export declare const instanceDestroy: import("../util/action").ActionCreator<string, {
    id: string;
}>;
export declare const instanceDestroySuccess: import("../util/action").ActionCreator<string, {
    id: string;
}>;
export declare const instanceDestroyError: import("../util/action").ActionCreator<string, {
    id: string;
}>;
