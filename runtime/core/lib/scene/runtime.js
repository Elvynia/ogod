"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OgodRuntimeSceneDefault = void 0;
const common_1 = require("@ogod/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const reactive_update_1 = require("../util/reactive-update");
class OgodRuntimeSceneDefault {
    initialize(state, state$) {
        return rxjs_1.of(common_1.sceneInitSuccess({
            id: state.id,
            state: Object.assign(Object.assign({}, state), { entities: state.entities || [], sub$: new Array(), loading: false, loaded: true })
        }));
    }
    start(state, state$) {
        console.log('[SCENE] Start', state.id);
        state.running = true;
        state.sub$.push(self.update$.pipe(operators_1.withLatestFrom(state$.pipe(operators_1.pluck('instance'), operators_1.map((instances) => Object.values(instances)
            .filter((instance) => instance.loaded)))), operators_1.map(([delta, instances]) => instances
            .filter((instance) => instance.running && instance.scenes.indexOf(state.id) >= 0)), operators_1.map((instances) => {
            const added = instances
                .filter((i) => state.entities.indexOf(i.id) < 0);
            const removed = state.entities
                .filter((id) => instances.findIndex((i) => i.id === id) < 0);
            return {
                added,
                removed
            };
        }), operators_1.filter(({ added, removed }) => added.length > 0 || removed.length > 0)).subscribe(({ added, removed }) => {
            added.forEach((instance) => {
                this.add(state, instance);
            });
            removed.forEach((id) => {
                const instance = self.store.getState().instance[id];
                this.remove(state, id, instance);
            });
        }));
        state.sub$.push(reactive_update_1.ogodReactiveUpdate(this, state));
    }
    add(state, child) {
        console.log('[SCENE] Add %s to %s', child.id, state.id);
        state.entities.push(child.id);
    }
    changes(changes, state) {
        return rxjs_1.of(common_1.sceneChangesSuccess({
            id: state.id,
            changes
        }));
    }
    remove(state, id, child) {
        console.log('[SCENE] Remove %s from %s', id, state.id);
        state.entities = state.entities.filter((childId) => id !== childId);
    }
    stop(state) {
        console.log('[SCENE] Stop', state.id);
        state.running = false;
        state.entities = [];
        state.sub$.forEach((sub) => sub.unsubscribe());
    }
    destroy({ id }) {
        return rxjs_1.of(common_1.sceneDestroySuccess({
            id
        }));
    }
}
exports.OgodRuntimeSceneDefault = OgodRuntimeSceneDefault;
//# sourceMappingURL=runtime.js.map