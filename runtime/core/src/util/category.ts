import { OgodRuntimeResource } from "../resource/runtime";
import { OgodRuntimeInstance } from "../instance/runtime";
import { OgodRuntimeScene } from "../scene/runtime";
import { OgodRuntimeSystem } from "../system/runtime";

export type OgodCategoryRuntime = {
    resource: OgodRuntimeResource;
    instance: OgodRuntimeInstance;
    scene: OgodRuntimeScene;
    system: OgodRuntimeSystem;
};
