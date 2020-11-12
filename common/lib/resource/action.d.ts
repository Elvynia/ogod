import { OgodActionActor } from './../actor/action';
import { OGOD_CATEGORY } from '../util/category';
import { OgodStateResource } from './state';
export interface OgodActionResource extends OgodActionActor<OgodStateResource, OGOD_CATEGORY.RESOURCE> {
}
export declare const resourceInit: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateResource;
}>;
export declare const resourceInitSuccess: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateResource;
}>;
export declare const resourceInitError: import("../util/action").ActionCreator<string, {
    id: string;
    state: OgodStateResource;
}>;
export declare const resourceDestroy: import("../util/action").ActionCreator<string, {
    id: string;
}>;
export declare const resourceDestroySuccess: import("../util/action").ActionCreator<string, {
    id: string;
}>;
export declare const resourceDestroyError: import("../util/action").ActionCreator<string, {
    id: string;
}>;
