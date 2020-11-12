import { OgodCategoryState } from "../util/category";
export declare type OgodStateEngine<C extends OgodCategoryState = OgodCategoryState> = {
    [K in keyof C]: {
        [id: string]: C[K];
    };
};
