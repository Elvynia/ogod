import { Subject } from "rxjs";

export type EngineActionType = 'OGOD_ENGINE_CLOSE' | 'OGOD_ENGINE_TARGET';
export const WorkerActionInit = 'OGOD_ENGINE_INIT';

export interface EngineAction<T = EngineActionType> {
    type: T;
    payload?: any;
}

export interface EngineActionCanvas<C = OffscreenCanvas> extends EngineAction<'OGOD_ENGINE_TARGET'> {
    type: 'OGOD_ENGINE_TARGET';
    payload: C;
}

export function isEngineActionInit(action: MessageEvent): action is MessageEvent<typeof WorkerActionInit> {
    return action.data === WorkerActionInit;
}

export function isEngineActionClose(action: EngineAction): action is EngineAction<'OGOD_ENGINE_CLOSE'> {
    return action.type === 'OGOD_ENGINE_CLOSE';
}

export function isEngineActionCanvas<C = OffscreenCanvas>(action: EngineAction): action is EngineActionCanvas<C> {
    return action.type === 'OGOD_ENGINE_TARGET';
}

export interface WorkerAction<K extends string = string, V extends any = any> {
    key: K;
    value?: V;
}

export interface ActionHandlerDefault {
    engine: Subject<EngineAction>;
}
