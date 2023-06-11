import { ActionEngine, WorkerAction } from "../action";

export type WorkerMessage<K extends string = string, V = any> = [WorkerAction<K, V>, StructuredSerializeOptions];
export type WorkerMessageEngine = WorkerMessage<'engine', ActionEngine>;

export const MessageEngineInit = 'OGOD_ENGINE_INIT';

export function isMessageEngineInit(data: any): data is typeof MessageEngineInit {
    return data === MessageEngineInit;
}
