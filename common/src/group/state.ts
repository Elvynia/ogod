import { OgodStateContainer } from "../container/state";
import { OgodStateInstance } from "../instance/state";
import { OGOD_CATEGORY } from "../util/category";

export interface OgodStateGroup extends OgodStateContainer<OGOD_CATEGORY.INSTANCE>, OgodStateInstance {

}
