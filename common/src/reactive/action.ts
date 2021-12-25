import { OgodActionCreator } from './../util/action';
import { ogodActionCreator, ogodActionName } from '../util/action';

export enum OGOD_ACTION_REACTIVE {
    START = 'START', STOP = 'STOP'
}

export function ogodActionCreatorReactive<P, C extends string = string>(
    category: C, action: OGOD_ACTION_REACTIVE): OgodActionCreator<P> {
    return ogodActionCreator<P>(ogodActionName(category, action));
}
