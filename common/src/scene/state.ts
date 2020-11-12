import { OGOD_CATEGORY } from "../util/category";
import { OgodStateContainer } from "../container/state";

export interface OgodStateScene extends OgodStateContainer<OGOD_CATEGORY.SCENE> {
}

export interface OgodStateScenes {
    [id: string]: OgodStateScene;
}
