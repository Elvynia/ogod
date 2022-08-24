import { WorkerAction, WorkerMessage } from '@ogod/game-core';

export function makeWorkerMessage(action: WorkerAction, options?: any[]): WorkerMessage {
    return [action, options];
}
