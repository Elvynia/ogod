import { OgodStateInstance } from "../instance/state";
import { OgodStateScene } from "../scene/state";
import { OgodStateResource } from "../resource/state";
import { OgodStateSystem } from "../system/state";
export declare type OgodCategoryState = {
    resource: OgodStateResource;
    instance: OgodStateInstance;
    scene: OgodStateScene;
    system: OgodStateSystem;
};
export declare enum OGOD_CATEGORY {
    RESOURCE = "resource",
    INSTANCE = "instance",
    SCENE = "scene",
    SYSTEM = "system"
}
