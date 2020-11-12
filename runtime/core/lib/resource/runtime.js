"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OgodRuntimeResourceDefault = void 0;
const common_1 = require("@ogod/common");
const rxjs_1 = require("rxjs");
class OgodRuntimeResourceDefault {
    initialize(state, state$) {
        return rxjs_1.of(common_1.resourceInitSuccess({
            id: state.id,
            state: Object.assign(Object.assign({}, state), { loading: false, loaded: true })
        }));
    }
    destroy({ id }) {
        return rxjs_1.of(common_1.resourceDestroySuccess({ id }));
    }
}
exports.OgodRuntimeResourceDefault = OgodRuntimeResourceDefault;
//# sourceMappingURL=runtime.js.map