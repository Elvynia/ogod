import { WorkerAction, WorkerMessage } from './state';

export function makeWorkerMessage(action: WorkerAction, options: StructuredSerializeOptions): WorkerMessage {
    return [action, options];
}
