import { OGOD_CATEGORY } from "../util/category";
import { OgodStateContainer } from "../container/state";

export interface OgodStateSystem extends OgodStateContainer<OGOD_CATEGORY.SYSTEM> {
    aspects: string[];
    mode: 'any' | 'all';
    acceptUnloaded?: boolean;
}

export interface OgodStateSystems {
    [id: string]: OgodStateSystem;
}
