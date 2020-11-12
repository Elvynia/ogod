"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodReducerCreator = exports.ogodReducerOn = void 0;
function ogodReducerOn(...args) {
    const reducer = args.pop();
    const types = args.reduce((result, creator) => [...result, creator.type], []);
    return { reducer, types };
}
exports.ogodReducerOn = ogodReducerOn;
function ogodReducerCreator(initialState, ...ons) {
    const map = new Map();
    for (let on of ons) {
        for (let type of on.types) {
            if (map.has(type)) {
                const existingReducer = map.get(type);
                const newReducer = (state, action) => on.reducer(existingReducer(state, action), action);
                map.set(type, newReducer);
            }
            else {
                map.set(type, on.reducer);
            }
        }
    }
    return function (state = initialState, action) {
        const reducer = map.get(action.type);
        return reducer ? reducer(state, action) : state;
    };
}
exports.ogodReducerCreator = ogodReducerCreator;
//# sourceMappingURL=reducer.js.map