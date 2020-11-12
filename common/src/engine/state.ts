import { OgodCategoryState } from "../util/category";

export type OgodStateEngine<C extends OgodCategoryState = OgodCategoryState> = {
    [K in keyof C]: { [id: string]: C[K] };
}
