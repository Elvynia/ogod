import { OgodStateReactive } from "../reactive/state";
import { OgodCategoryState } from "../util/category";

export interface OgodStateContainer<C extends keyof OgodCategoryState> extends OgodStateReactive<C> {
    entities: Array<string>;
}
