"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OgodBox2dRegistry = void 0;
const runtime_1 = require("./system/physics/runtime");
const runtime_2 = require("./system/jump/runtime");
const runtime_3 = require("./scene/debug/runtime");
exports.OgodBox2dRegistry = {
    'system.physics': runtime_1.Box2dRuntimePhysics,
    'system.jump': runtime_2.Box2dRuntimeJump,
    'scene.box2d-debug': runtime_3.Box2dRuntimeDebug
};
//# sourceMappingURL=registry.js.map