import { EngineAction, EngineActionType, WorkerAction, WorkerMessage } from '@ogod/game-core';

export function makeWorkerMessage(action: WorkerAction, options?: any[]): WorkerMessage {
    return [action, options];
}

export function makeEngineAction(type: EngineActionType, payload?: any, options?: any[]): WorkerMessage<'engine', EngineAction> {
    return [{
        key: 'engine',
        value: {
            type,
            payload
        }
    }, options];
}
