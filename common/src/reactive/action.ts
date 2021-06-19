import { ogodActionCreator, ogodActionName } from '../util/action';

export enum OGOD_ACTION_REACTIVE {
    START = 'START', STOP = 'STOP'
}

export function ogodActionCreatorReactive<C extends string, P extends object>(category: C, action: OGOD_ACTION_REACTIVE, params?: P) {
    return ogodActionCreator(ogodActionName(category, action), params);
}
