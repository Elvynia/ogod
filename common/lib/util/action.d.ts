import { Action } from 'redux';
export declare interface TypedAction<T extends string> extends Action {
    readonly type: T;
}
export declare type ActionCreator<T extends string = string, P extends object = object> = ((props?: P) => P & TypedAction<T>) & TypedAction<T>;
export declare function ogodActionName<T extends string>(category: string, name: string): string;
export declare function ogodActionParams<P extends object>(): P;
export declare function ogodActionCreator<T extends string, P extends object>(type: T, params?: P): ActionCreator<T, P>;
