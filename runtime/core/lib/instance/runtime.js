"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OgodRuntimeInstanceDefault = void 0;
const common_1 = require("@ogod/common");
const rxjs_1 = require("rxjs");
const reactive_update_1 = require("../util/reactive-update");
class OgodRuntimeInstanceDefault {
    initialize(state, state$) {
        return rxjs_1.of(common_1.instanceInitSuccess({
            id: state.id,
            state: Object.assign(Object.assign({}, state), { scenes: state.scenes || [], sub$: new Array(), loading: false, loaded: true })
        }));
    }
    start(state, state$) {
        console.log('[INSTANCE] Start', state.id);
        state.running = true;
        state.sub$.push(reactive_update_1.ogodReactiveUpdate(this, state));
    }
    changes(changes, state) {
        return rxjs_1.of(common_1.instanceChangesSuccess({
            id: state.id,
            changes
        }));
    }
    stop(state) {
        console.log('[INSTANCE] Stop', state.id);
        state.running = false;
        state.sub$.forEach((sub) => sub.unsubscribe());
    }
    destroy({ id }) {
        return rxjs_1.of(common_1.instanceDestroySuccess({
            id
        }));
    }
}
exports.OgodRuntimeInstanceDefault = OgodRuntimeInstanceDefault;
//# sourceMappingURL=runtime.js.map