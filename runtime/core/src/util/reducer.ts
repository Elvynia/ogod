import { OgodActionCreator } from '@ogod/common';
import { Action, Reducer } from 'redux';

export interface On<S> {
    reducer: Reducer<S>;
    types: string[];
}

export function ogodReducerOn<S>(
    ...args: (OgodActionCreator | Function)[]
): { reducer: Reducer<S>; types: string[] } {
    const reducer = args.pop() as Reducer<S>;
    const types = args.reduce(
        (result, creator) => [...result, (creator as OgodActionCreator).type],
        [] as string[]
    );
    return { reducer, types };
}

export function ogodReducerCreator<S, A extends Action = Action>(
    initialState: S,
    ...ons: On<S>[]
): Reducer<S, A> {
    const map = new Map<string, Reducer<S, A>>();
    for (let on of ons) {
        for (let type of on.types) {
            if (map.has(type)) {
                const existingReducer = map.get(type) as Reducer<S, A>;
                const newReducer: Reducer<S, A> = (state, action) =>
                    on.reducer(existingReducer(state, action), action);
                map.set(type, newReducer);
            } else {
                map.set(type, on.reducer);
            }
        }
    }

    return function (state: S = initialState, action: A): S {
        const reducer = map.get(action.type);
        return reducer ? reducer(state, action) : state;
    };
}
