"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodActionCreator = exports.ogodActionParams = exports.ogodActionName = void 0;
function ogodActionName(category, name) {
    return `[OGOD][${category}] ${name}`;
}
exports.ogodActionName = ogodActionName;
function ogodActionParams() { return {}; }
exports.ogodActionParams = ogodActionParams;
;
function ogodActionCreator(type, params) {
    return Object.defineProperty((props = {}) => (Object.assign(Object.assign({}, props), { type })), 'type', {
        value: type,
        writable: false
    });
}
exports.ogodActionCreator = ogodActionCreator;
//# sourceMappingURL=action.js.map