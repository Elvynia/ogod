"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodRuntimeEngineDefault = exports.stop = exports.start = exports.nextCanvas = exports.initEngine = exports.requestAnimationFrame$ = void 0;
const common_1 = require("@ogod/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const reactive_watch_1 = require("../util/reactive-watch");
exports.requestAnimationFrame$ = rxjs_1.defer(() => rxjs_1.of(rxjs_1.animationFrameScheduler.now(), rxjs_1.animationFrameScheduler).pipe(operators_1.repeat(), operators_1.map((start) => rxjs_1.animationFrameScheduler.now() - start), operators_1.pairwise(), operators_1.map((time) => time[1] - time[0])));
exports.initEngine = (id, categories = Object.values(common_1.OGOD_CATEGORY)) => {
    console.log('[ENGINE] Initialize');
    self.running = false;
    self.runtimes = categories
        .map((category) => ({ [category]: {} }))
        .reduce((a, b) => Object.assign(a, b), {});
    self.id = id;
};
exports.nextCanvas = (canvas) => {
    Object.entries(self.runtimes['scene'])
        .map(([id, scene]) => ({
        runtime: scene,
        state: self.store.getState().scene[id]
    }))
        .forEach((scene) => {
        const changes = scene.runtime.nextCanvas(scene.state, canvas, self.canvas);
        if (changes) {
            self.store.dispatch(common_1.sceneChangesCanvas({
                id: scene.state.id,
                changes
            }));
        }
    });
    self.canvas = canvas;
};
exports.start = () => {
    console.log('[ENGINE] Start');
    self.running = true;
    self.update$ = new rxjs_1.Subject();
    self.reflect$ = new rxjs_1.Subject();
    exports.requestAnimationFrame$.subscribe(self.update$);
    reactive_watch_1.watchReactiveStates('system');
    reactive_watch_1.watchReactiveStates('scene');
    reactive_watch_1.watchReactiveStates('instance');
    self.update$.pipe(operators_1.withLatestFrom(self.state$.pipe(operators_1.map((fs) => Object.values(fs.scene).filter((scene) => scene.loaded))))).subscribe(([delta, scenes]) => {
        scenes.filter((scene) => scene.running).forEach((scene) => self.runtimes['scene'][scene.id].render(scene));
    });
    self.reflect$.pipe(
    // bufferTime(self.intervalUpdate, animationFrameScheduler), FIXME: scheduler
    operators_1.bufferTime(self.intervalUpdate, rxjs_1.asyncScheduler), operators_1.filter((updates) => updates.length > 0)).subscribe((updates) => self.postMessage(common_1.engineReflectUpdates({ updates })));
};
exports.stop = () => {
    console.log('[ENGINE] Stop');
    self.update$.complete();
    self.reflect$.complete();
    // self.subscriptions.forEach((sub) => sub.unsubscribe());
    self.running = false;
};
function ogodRuntimeEngineDefault(evt) {
    switch (evt.data.type) {
        case common_1.engineInit.type:
            exports.initEngine(evt.data.id);
            break;
        case common_1.engineCanvas.type:
            exports.nextCanvas(evt.data.canvas);
            break;
        case common_1.engineStart.type:
            if (!self.running) {
                exports.start();
            }
            else {
                console.warn('[ENGINE] Cannot start engine, already running !');
            }
            break;
        case common_1.engineStop.type:
            if (self.running) {
                exports.stop();
            }
            else {
                console.warn('[ENGINE] Cannot stop engine, already stopped !');
            }
            break;
        case common_1.engineDestroy.type:
            console.log('[ENGINE] Destroy');
            exports.stop();
            self.close();
            break;
        default:
            self.store.dispatch(Object.assign({}, evt.data));
            break;
    }
}
exports.ogodRuntimeEngineDefault = ogodRuntimeEngineDefault;
//# sourceMappingURL=runtime.js.map