import { OGOD_CATEGORY } from '../util/category';
import { OgodStateActor } from '../actor/state';
export interface OgodStateResource extends OgodStateActor<OGOD_CATEGORY.RESOURCE> {
    path: string;
}
export interface OgodStateResources {
    [id: string]: OgodStateResource;
}
