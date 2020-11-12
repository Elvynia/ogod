"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodReducerInstance = void 0;
const common_1 = require("@ogod/common");
const reducer_1 = require("../util/reducer");
function ogodReducerInstance(initialState = {}) {
    return reducer_1.ogodReducerCreator(initialState, reducer_1.ogodReducerOn(common_1.instanceInit, (state, action) => (Object.assign(Object.assign({}, state), { [action.id]: Object.assign(Object.assign({}, action.state), { loading: true }) }))), reducer_1.ogodReducerOn(common_1.instanceInitSuccess, (state, action) => (Object.assign(Object.assign({}, state), { [action.id]: Object.assign(Object.assign({}, action.state), { loading: false, loaded: true }) }))), reducer_1.ogodReducerOn(common_1.instanceChangesSuccess, (state, action) => {
        Object.assign(state[action.id], action.changes);
        return Object.assign({}, state);
    }), reducer_1.ogodReducerOn(common_1.instanceAdd, (state, action) => {
        state[action.id].scenes.push(action.sceneId);
        return Object.assign({}, state);
    }), reducer_1.ogodReducerOn(common_1.instanceRemove, (state, action) => {
        state[action.id].scenes = state[action.id].scenes.filter((id) => id !== action.sceneId);
        return Object.assign({}, state);
    }), reducer_1.ogodReducerOn(common_1.instanceDestroySuccess, common_1.instanceDestroyError, common_1.instanceInitError, (state, action) => {
        if (self.runtimes[common_1.OGOD_CATEGORY.INSTANCE][action.id]) {
            delete self.runtimes[common_1.OGOD_CATEGORY.INSTANCE][action.id];
        }
        const _a = state, _b = action.id, removed = _a[_b], states = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        return Object.assign({}, states);
    }));
}
exports.ogodReducerInstance = ogodReducerInstance;
//# sourceMappingURL=reducer.js.map