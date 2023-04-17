import { WorkerAction } from "./action.state";

export type WorkerMessage<K extends string = string, V = any> = [WorkerAction<K, V>, any[]?];
