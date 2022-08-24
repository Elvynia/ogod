export interface WorkerAction {
    key: string;
    value?: any;
}

export type WorkerMessage = [WorkerAction, StructuredSerializeOptions?];
