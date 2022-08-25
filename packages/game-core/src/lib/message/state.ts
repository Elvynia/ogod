export interface WorkerAction<K extends string = string, V extends any = any> {
    key: K;
    value?: V;
}

export type WorkerMessage<K extends string = string, V extends any = any> = [WorkerAction<K, V>, any[]?];
