import { Action } from 'redux';
import { OgodStateActor } from './state';
import { OgodCategoryState } from '../util/category';
export declare enum OGOD_ACTION_ACTOR {
    INIT = "INIT",
    INIT_SUCCESS = "INIT_SUCCESS",
    INIT_ERROR = "INIT_ERROR",
    CHANGES = "CHANGES",
    CHANGES_SUCCESS = "CHANGES_SUCCESS",
    CHANGES_ERROR = "CHANGES_ERROR",
    DESTROY = "DESTROY",
    DESTROY_SUCCESS = "DESTROY_SUCCESS",
    DESTROY_ERROR = "DESTROY_ERROR"
}
export interface OgodActionActor<S extends OgodStateActor<C>, C extends keyof OgodCategoryState = S['category']> extends Action {
    id: string;
    state?: S;
}
export declare function ogodActionCreatorActor<C extends string, P extends object>(category: C, action: OGOD_ACTION_ACTOR, params?: P): import("../util/action").ActionCreator<string, P>;
