import { Action } from 'redux';
import { OgodActionCreator, ogodActionCreator, ogodActionName } from '../util/action';
import { OgodStateActor } from './state';

export enum OGOD_ACTION_ACTOR {
    INIT = 'INIT', INIT_SUCCESS = 'INIT_SUCCESS', INIT_ERROR = 'INIT_ERROR',
    CHANGES = 'CHANGES', CHANGES_SUCCESS = 'CHANGES_SUCCESS', CHANGES_ERROR = 'CHANGES_ERROR',
    DESTROY = 'DESTROY', DESTROY_SUCCESS = 'DESTROY_SUCCESS', DESTROY_ERROR = 'DESTROY_ERROR'
}

export interface OgodActionActor<S extends OgodStateActor<C>, C extends string = S['category']>  {
    id: string;
    state?: S;
    changes?: Partial<S>;
}

export function ogodActionCreatorActor<P extends OgodActionActor<S, C>, S extends OgodStateActor<C>, C extends string = S['category']>(
    category: C, action: OGOD_ACTION_ACTOR): OgodActionCreator<P> {
    return ogodActionCreator<P>(ogodActionName(category, action) as C);
}
