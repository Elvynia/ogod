export interface KeyState {
    [key: string]: string;
}

export type Controls<S extends KeyState> = {
    [K in keyof S]: boolean;
}
