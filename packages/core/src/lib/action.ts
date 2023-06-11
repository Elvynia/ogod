import { Subject } from "rxjs";

export interface WorkerAction<K extends string = string, V extends any = any> {
    key: K;
    value?: V;
}

export type ActionEngineType = 'OGOD_ENGINE_CLOSE' | 'OGOD_ENGINE_TARGET' | 'OGOD_ENGINE_RESIZE';

export interface ActionEngine<T = ActionEngineType> {
    type: T;
    payload?: any;
}

export interface EngineActionTarget<C = OffscreenCanvas> extends ActionEngine<'OGOD_ENGINE_TARGET'> {
    type: 'OGOD_ENGINE_TARGET';
    payload: C;
}

export interface EngineActionResize extends ActionEngine<'OGOD_ENGINE_RESIZE'> {
    type: 'OGOD_ENGINE_RESIZE';
    payload: {
        width: number;
        height: number;
    };
}

export function isActionEngineClose(action: ActionEngine): action is ActionEngine<'OGOD_ENGINE_CLOSE'> {
    return action.type === 'OGOD_ENGINE_CLOSE';
}

export function isActionEngineTarget<C = OffscreenCanvas>(action: ActionEngine): action is EngineActionTarget<C> {
    return action.type === 'OGOD_ENGINE_TARGET';
}

export function isActionEngineResize(action: ActionEngine): action is EngineActionResize {
    return action.type === 'OGOD_ENGINE_RESIZE';
}

export interface ActionHandlerDefault {
    engine: Subject<ActionEngine>;
}
