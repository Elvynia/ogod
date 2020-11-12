import { OgodStateInstance } from "../instance/state";
import { OgodStateScene } from "../scene/state";
import { OgodStateResource } from "../resource/state";
import { OgodStateSystem } from "../system/state";

export type OgodCategoryState = {
    resource: OgodStateResource;
    instance: OgodStateInstance;
    scene: OgodStateScene;
    system: OgodStateSystem;
};

export enum OGOD_CATEGORY {
    RESOURCE = 'resource',
    INSTANCE = 'instance',
    SCENE = 'scene',
    SYSTEM = 'system'
}
