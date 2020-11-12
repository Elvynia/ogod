import { OGOD_CATEGORY } from "../util/category";
import { OgodStateReactive } from "../reactive/state";

export interface OgodStateInstance extends OgodStateReactive<OGOD_CATEGORY.INSTANCE> {
    scenes: string[];
}

export interface OgodStateInstances {
    [id: string]: OgodStateInstance;
}
