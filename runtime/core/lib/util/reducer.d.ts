import { ActionCreator } from '@ogod/common';
import { Action, Reducer } from 'redux';
export interface On<S> {
    reducer: Reducer<S>;
    types: string[];
}
export declare function ogodReducerOn<S>(...args: (ActionCreator | Function)[]): {
    reducer: Reducer<S>;
    types: string[];
};
export declare function ogodReducerCreator<S, A extends Action = Action>(initialState: S, ...ons: On<S>[]): Reducer<S, A>;
