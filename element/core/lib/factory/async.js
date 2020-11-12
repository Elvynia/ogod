"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodDispatchChildChanges = exports.dispatchAsyncChildReady = exports.OGOD_ASYNC_CHILD_CHANGES = exports.OGOD_ASYNC_CHILD_READY = void 0;
const hybrids_1 = require("hybrids");
exports.OGOD_ASYNC_CHILD_READY = 'OGOD_ASYNC_CHILD_READY';
exports.OGOD_ASYNC_CHILD_CHANGES = 'OGOD_ASYNC_CHILD_CHANGES';
function dispatchAsyncChildReady(host, propName) {
    return hybrids_1.dispatch(host, exports.OGOD_ASYNC_CHILD_READY, {
        detail: {
            referer: propName
        }
    });
}
exports.dispatchAsyncChildReady = dispatchAsyncChildReady;
function ogodDispatchChildChanges(host, referer) {
    return hybrids_1.dispatch(host, exports.OGOD_ASYNC_CHILD_CHANGES, {
        detail: {
            referer
        }
    });
}
exports.ogodDispatchChildChanges = ogodDispatchChildChanges;
//# sourceMappingURL=async.js.map