import { OgodCategoryState } from './../util/category';

export interface OgodStateActor<C extends keyof OgodCategoryState> {
    category: C;
    id: string;
    loading: boolean;
    loaded: boolean;
    runtime: string;
}

export interface OgodStateActors<C extends keyof OgodCategoryState> {
    [id: string]: OgodStateActor<C>;
}
