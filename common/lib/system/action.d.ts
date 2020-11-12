import { OGOD_CATEGORY } from '../util/category';
import { OgodActionReactive } from '../reactive/action';
import { OgodActionActor } from './../actor/action';
import { OgodStateSystem } from './state';
export interface OgodActionSystem extends OgodActionActor<OgodStateSystem, OGOD_CATEGORY.SYSTEM>, OgodActionReactive<OgodStateSystem> {
}
export declare const systemInit: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateSystem;
}>;
export declare const systemInitSuccess: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateSystem;
}>;
export declare const systemInitError: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateSystem;
}>;
export declare const systemChanges: import("../util/action").ActionCreator<string, {
    id: string;
    changes?: Partial<OgodStateSystem>;
}>;
export declare const systemChangesSuccess: import("../util/action").ActionCreator<string, {
    id: string;
    changes?: Partial<OgodStateSystem>;
}>;
export declare const systemChangesError: import("../util/action").ActionCreator<string, {
    id: string;
    changes?: Partial<OgodStateSystem>;
}>;
export declare const systemDestroy: import("../util/action").ActionCreator<string, {
    id: string;
}>;
export declare const systemDestroySuccess: import("../util/action").ActionCreator<string, {
    id: string;
}>;
export declare const systemDestroyError: import("../util/action").ActionCreator<string, {
    id: string;
}>;
