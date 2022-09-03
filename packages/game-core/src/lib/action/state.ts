import { Subject } from "rxjs";

export type EngineActionType = 'OGOD_ENGINE_CLOSE'
    | 'OGOD_ENGINE_HANDLER_ADD'
    | 'OGOD_ENGINE_HANDLER_ADD_KEY'
    | 'OGOD_ENGINE_HANDLER_COMPLETE'
    | 'OGOD_ENGINE_CANVAS';

export interface EngineAction {
    type: EngineActionType;
    payload?: any;
}

export interface EngineActionHandlerAdd extends EngineAction {
    type: 'OGOD_ENGINE_HANDLER_ADD';
    payload: ActionState<any>;
}

export interface EngineActionHandlerAddKey extends EngineAction {
    type: 'OGOD_ENGINE_HANDLER_ADD_KEY';
    payload: string;
}

export interface EngineActionHandlerComplete extends EngineAction {
    type: 'OGOD_ENGINE_HANDLER_COMPLETE';
    payload: string;
}

export interface EngineActionCanvas extends EngineAction {
    type: 'OGOD_ENGINE_CANVAS';
    payload: any;
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

export function isEngineActionCanvas(action: EngineAction): action is EngineActionCanvas {
    return action.type === 'OGOD_ENGINE_CANVAS';
}

export type EngineActionState = {
    engine: Subject<EngineAction>;
}

export type ActionState<A extends string> = Record<A, Subject<any>> & EngineActionState;
