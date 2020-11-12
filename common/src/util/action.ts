import { Action } from 'redux';

export declare interface TypedAction<T extends string> extends Action {
    readonly type: T;
}

export type ActionCreator<T extends string = string, P extends object = object> = ((props?: P) => P & TypedAction<T>) & TypedAction<T>;

export function ogodActionName<T extends string>(category: string, name: string) {
    return `[OGOD][${category}] ${name}`;
}

export function ogodActionParams<P extends object>(): P { return {} as P; };

export function ogodActionCreator<T extends string, P extends object>(type: T, params?: P): ActionCreator<T, P> {
    return Object.defineProperty((props: P = {} as any) => ({
        ...props,
        type,
    }), 'type', {
        value: type,
        writable: false
    });
}
