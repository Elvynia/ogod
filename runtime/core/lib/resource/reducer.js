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
exports.ogodReducerResource = void 0;
const common_1 = require("@ogod/common");
const reducer_1 = require("../util/reducer");
function ogodReducerResource(initialState = {}) {
    return reducer_1.ogodReducerCreator(initialState, reducer_1.ogodReducerOn(common_1.resourceInit, (states, { id, state }) => (Object.assign(Object.assign({}, states), { [id]: Object.assign(Object.assign({}, state), { loading: true }) }))), reducer_1.ogodReducerOn(common_1.resourceInitSuccess, (states, { id, state }) => (Object.assign(Object.assign({}, states), { [id]: Object.assign(Object.assign({}, state), { loading: false, loaded: true }) }))), reducer_1.ogodReducerOn(common_1.resourceDestroySuccess, common_1.resourceDestroyError, common_1.resourceInitError, (states, { id }) => {
        if (self.runtimes[common_1.OGOD_CATEGORY.RESOURCE][id]) {
            delete self.runtimes[common_1.OGOD_CATEGORY.RESOURCE][id];
        }
        const _a = states, _b = id, removed = _a[_b], remaining = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        return Object.assign({}, remaining);
    }));
}
exports.ogodReducerResource = ogodReducerResource;
//# sourceMappingURL=reducer.js.map