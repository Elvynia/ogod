import { SubjectLike } from "rxjs";

export type EngineActionType = 'OGOD_ENGINE_CLOSE'
    | 'OGOD_ENGINE_HANDLER_ADD'
    | 'OGOD_ENGINE_HANDLER_ADD_KEY'
    | 'OGOD_ENGINE_HANDLER_COMPLETE'
    | 'OGOD_ENGINE_TARGET';

export interface EngineAction {
    type: EngineActionType;
    payload?: any;
}

export interface EngineActionHandlerAdd extends EngineAction {
    type: 'OGOD_ENGINE_HANDLER_ADD';
    payload: Record<string, SubjectLike<any>>;
}

export interface EngineActionHandlerAddKey extends EngineAction {
    type: 'OGOD_ENGINE_HANDLER_ADD_KEY';
    payload: string;
}

export interface EngineActionHandlerComplete extends EngineAction {
    type: 'OGOD_ENGINE_HANDLER_COMPLETE';
    payload: string;
}

export interface EngineActionCanvas<C = OffscreenCanvas> extends EngineAction {
    type: 'OGOD_ENGINE_TARGET';
    payload: C;
}

export function isEngineActionHandlerAdd(action: EngineAction): action is EngineActionHandlerAdd {
    return action.type === 'OGOD_ENGINE_HANDLER_ADD';
}

export function isEngineActionHandlerAddKey(action: EngineAction): action is EngineActionHandlerAddKey {
    return action.type === 'OGOD_ENGINE_HANDLER_ADD_KEY';
}

export function isEngineActionHandlerComplete(action: EngineAction): action is EngineActionHandlerComplete {
    return action.type === 'OGOD_ENGINE_HANDLER_COMPLETE';
}

export function isEngineActionCanvas<C = OffscreenCanvas>(action: EngineAction): action is EngineActionCanvas<C> {
    return action.type === 'OGOD_ENGINE_TARGET';
}

export interface WorkerAction<K extends string = string, V extends any = any> {
    key: K;
    value?: V;
}
