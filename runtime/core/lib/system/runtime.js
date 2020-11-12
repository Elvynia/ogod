"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OgodRuntimeSystemDefault = exports.ogodAspectAll = exports.ogodAspectAny = void 0;
const common_1 = require("@ogod/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const reactive_update_1 = require("../util/reactive-update");
function ogodAspectAny(aspects) {
    return (instance) => aspects.some((key) => Object.entries(instance)
        .filter(([k, value]) => value !== undefined)
        .map(([k]) => k)
        .indexOf(key) >= 0);
}
exports.ogodAspectAny = ogodAspectAny;
function ogodAspectAll(aspects) {
    return (instance) => aspects.every((key) => Object.entries(instance)
        .filter(([k, value]) => value !== undefined)
        .map(([k]) => k)
        .indexOf(key) >= 0);
}
exports.ogodAspectAll = ogodAspectAll;
class OgodRuntimeSystemDefault {
    initialize(state, state$) {
        return rxjs_1.of(common_1.systemInitSuccess({
            id: state.id,
            state: Object.assign(Object.assign({}, state), { entities: [], sub$: new Array(), loading: false, loaded: true })
        }));
    }
    start(state, state$) {
        console.log('[SYSTEM] Start', state.id);
        state.running = true;
        if (state.aspects) {
            state.sub$.push(self.update$.pipe(operators_1.withLatestFrom(state$.pipe(operators_1.pluck('instance'), operators_1.map((instances) => Object.values(instances)
                .filter((instance) => instance.loaded)))), 
            // FIXME: instance running filter
            operators_1.map(([delta, instances]) => this.filter(state, instances)), operators_1.map((instances) => {
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
        }
        state.sub$.push(reactive_update_1.ogodReactiveUpdate(this, state));
    }
    add(state, child) {
        console.log('[SYSTEM] Add %s to %s', child.id, state.id);
        state.entities.push(child.id);
    }
    changes(changes, state) {
        return rxjs_1.of(common_1.systemChangesSuccess({
            id: state.id,
            changes
        }));
    }
    remove(state, id, child) {
        console.log('[SYSTEM] Remove %s to %s', child.id, state.id);
        state.entities = state.entities.filter((childId) => id !== childId);
    }
    stop(state) {
        console.log('[SYSTEM] Stop', state.id);
        state.running = false;
        state.entities = [];
        state.sub$.forEach((sub) => sub.unsubscribe());
    }
    destroy({ id }) {
        return rxjs_1.of(common_1.systemDestroySuccess({
            id
        }));
    }
    filter(state, instances) {
        if (state.mode === 'all') {
            return instances.filter(ogodAspectAll(state.aspects));
        }
        return instances.filter(ogodAspectAny(state.aspects));
    }
}
exports.OgodRuntimeSystemDefault = OgodRuntimeSystemDefault;
//# sourceMappingURL=runtime.js.map