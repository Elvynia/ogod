import { EngineAction, EngineActionType, WorkerAction, WorkerMessage } from '@ogod/game-core';

export function makeWorkerMessage<K extends string, V>(action: WorkerAction<K, V>, transfer?: Transferable[]): WorkerMessage<K, V> {
    return [action, { transfer }];
}

export function makeEngineAction(type: EngineActionType, payload?: any, transfer?: Transferable[]): WorkerMessage<'engine', EngineAction> {
    return makeWorkerMessage({
        key: 'engine',
        value: {
            type,
            payload
        }
    }, transfer);
}
