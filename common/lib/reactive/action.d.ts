import { OgodActionActor } from "../actor/action";
import { OgodStateReactive } from "./state";
import { OgodCategoryState } from "../util/category";
export interface OgodActionReactive<S extends OgodStateReactive<C>, C extends keyof OgodCategoryState = S['category']> extends OgodActionActor<S> {
    id: string;
    changes?: Partial<S>;
}
