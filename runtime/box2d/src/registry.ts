import { Box2dRuntimePhysics } from "./system/physics/runtime";
import { Box2dRuntimeJump } from "./system/jump/runtime";
import { Box2dRuntimeDebug } from "./scene/debug/runtime";

export const OgodBox2dRegistry = {
    'system.physics': Box2dRuntimePhysics,
    'system.jump': Box2dRuntimeJump,
    'scene.box2d-debug': Box2dRuntimeDebug
};
