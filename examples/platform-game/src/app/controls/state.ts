export interface KeyState {
    [key: string]: string;
}

export type Controls<S extends KeyState = any> = Record<keyof S, boolean>;
