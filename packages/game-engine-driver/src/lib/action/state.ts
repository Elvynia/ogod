import { Subject } from "rxjs";
import { OffscreenCanvas } from '../engine/state';

export type EngineActionType = 'OGOD_ENGINE_CLOSE'
    | 'OGOD_ENGINE_HANDLER_ADD'
    | 'OGOD_ENGINE_HANDLER_ADD_KEY'
    | 'OGOD_ENGINE_HANDLER_COMPLETE'
    | 'OGOD_ENGINE_CANVAS';

export interface EngineAction {
    type: EngineActionType;
}

export interface EngineActionHandlerAdd<A = any> extends EngineAction {
    type: 'OGOD_ENGINE_HANDLER_ADD';
    handler: ActionState<A>;
}

export interface EngineActionHandlerAddKey extends EngineAction {
    type: 'OGOD_ENGINE_HANDLER_ADD_KEY';
    key: string;
}

export interface EngineActionHandlerComplete extends EngineAction {
    type: 'OGOD_ENGINE_HANDLER_COMPLETE';
    key: string;
}

export interface EngineActionCanvas extends EngineAction {
    type: 'OGOD_ENGINE_CANVAS';
    canvas: OffscreenCanvas;
}

export function isEngineActionHandlerAdd<A = any>(action: EngineAction): action is EngineActionHandlerAdd<A> {
    return action.type === 'OGOD_ENGINE_HANDLER_ADD';
}

export function isEngineActionHandlerAddKey<A = any>(action: EngineAction): action is EngineActionHandlerAddKey {
    return action.type === 'OGOD_ENGINE_HANDLER_ADD_KEY';
}

export function isEngineActionHandlerComplete<A = any>(action: EngineAction): action is EngineActionHandlerComplete {
    return action.type === 'OGOD_ENGINE_HANDLER_COMPLETE';
}

export function isEngineActionCanvas<A = any>(action: EngineAction): action is EngineActionCanvas {
    return action.type === 'OGOD_ENGINE_CANVAS';
}

export type ActionState<A> = {
    [key in keyof A]: Subject<any>;
};

export type ActionHandler<A> = ActionState<A> & {
    engine: Subject<EngineAction>;
};
