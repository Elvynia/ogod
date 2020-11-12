"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridInstanceRef = void 0;
const hybrids_1 = require("hybrids");
const parent_1 = require("../factory/parent");
const operators_1 = require("rxjs/operators");
const common_1 = require("@ogod/common");
function ogodHybridInstanceRef() {
    return {
        scene: parent_1.ogodFactoryParent('scene'),
        target: hybrids_1.property(''),
        active: Object.assign(Object.assign({}, hybrids_1.property(false)), { observe: ({ scene, target }, value, lastValue) => {
                if (scene && target && value !== lastValue) {
                    if (value) {
                        scene.engine.state$.pipe(operators_1.filter((fs) => fs[target] && fs[target].loaded), operators_1.first()).subscribe(() => scene.engine.worker.postMessage(common_1.instanceAdd({
                            id: target,
                            sceneId: scene.id
                        })));
                    }
                    else if (lastValue) {
                        scene.engine.worker.postMessage(common_1.instanceRemove({
                            id: target,
                            sceneId: scene.id
                        }));
                    }
                }
            } })
    };
}
exports.ogodHybridInstanceRef = ogodHybridInstanceRef;
//# sourceMappingURL=hybrid.js.map