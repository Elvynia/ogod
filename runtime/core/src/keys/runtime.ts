import { OgodFeatureKeys } from "./state";

export function ogodRuntimeKeys(state: OgodFeatureKeys) {
    if (state.keys && state.keys.values) {
        state.keys$ = state.keys.values
            .map((key) => ({ [key.name]: key.pressed ? 1 : 0 }))
            .reduce((a, b) => Object.assign(a, b), {});
    }
    return state;
}
