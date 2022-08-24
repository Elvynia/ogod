import { WorkerAction, WorkerMessage } from './state';

export function makeWorkerMessage(action: WorkerAction, options?: any[]): WorkerMessage {
    return [action, options];
}
