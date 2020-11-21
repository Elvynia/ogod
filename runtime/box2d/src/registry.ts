import { Box2dRuntimePhysics } from "./system/physics/runtime";
import { Box2dRuntimeJump } from "./system/jump/runtime";
import { Box2dRuntimeDebug } from "./scene/debug/runtime";
import { OgodRegistry } from "@ogod/runtime-core";
import { Box2dRuntimeVelocity } from "./system/velocity/runtime";

export const OgodBox2dRegistry: OgodRegistry = {
    'system.physics': Box2dRuntimePhysics,
    'system.jump': Box2dRuntimeJump,
    'system.velocity': Box2dRuntimeVelocity,
    'scene.box2d-debug': Box2dRuntimeDebug
};
