"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridRouter = void 0;
const hybrids_1 = require("hybrids");
const parent_1 = require("../factory/parent");
const common_1 = require("@ogod/common");
function ogodHybridRouter() {
    return {
        engine: parent_1.ogodFactoryParent('engine'),
        path: Object.assign(Object.assign({}, hybrids_1.property('')), { observe: (host, value, lastValue) => {
                if (lastValue) {
                    host.engine.worker.postMessage(common_1.sceneChanges({
                        id: lastValue,
                        changes: { active: false }
                    }));
                }
                if (value) {
                    host.engine.worker.postMessage(common_1.sceneChanges({
                        id: value,
                        changes: { active: true }
                    }));
                }
            } }),
        switch: hybrids_1.property({}, (host) => {
            host.addEventListener('ogod-router', (e) => {
                if (host.switch.next) {
                    host.switch.next(host);
                }
            });
        })
    };
}
exports.ogodHybridRouter = ogodHybridRouter;
//# sourceMappingURL=hybrid.js.map