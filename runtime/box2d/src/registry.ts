import { Box2dRuntimePhysics } from "./system/physics/runtime";
import { Box2dRuntimeDebug } from "./scene/debug/runtime";
import { OgodRegistry } from "@ogod/runtime-core";
import { Box2dRuntimeVelocity } from "./system/velocity/runtime";
import { DefaultContactListener } from "./system/physics/contact-listener/runtime";

export const OgodBox2dRegistry: OgodRegistry = {
    'system.physics': Box2dRuntimePhysics,
    'system.velocity': Box2dRuntimeVelocity,
    'contact-listener.default': DefaultContactListener,
    'scene.box2d-debug': Box2dRuntimeDebug
};
