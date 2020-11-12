import { Box2dRuntimePhysics } from "./system/physics/runtime";
import { Box2dRuntimeJump } from "./system/jump/runtime";
import { Box2dRuntimeDebug } from "./scene/debug/runtime";
export declare const OgodBox2dRegistry: {
    'system.physics': typeof Box2dRuntimePhysics;
    'system.jump': typeof Box2dRuntimeJump;
    'scene.box2d-debug': typeof Box2dRuntimeDebug;
};
