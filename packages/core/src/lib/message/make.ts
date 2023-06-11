import { ActionEngineType, WorkerAction } from "../action";
import { WorkerMessage, WorkerMessageEngine } from "./state";

export function makeMessage<K extends string, V>(action: WorkerAction<K, V>, transfer?: Transferable[]): WorkerMessage<K, V> {
    return [action, { transfer }];
}

export function makeMessageEngine(type: ActionEngineType, payload?: any, transfer?: Transferable[]): WorkerMessageEngine {
    return makeMessage({
        key: 'engine',
        value: {
            type,
            payload
        }
    }, transfer);
}
