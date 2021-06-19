import { OgodCategoryState } from './../util/category';

export interface OgodStateActor<C extends string> {
    category: C;
    id: string;
    runtime: string;
    loading?: boolean;
    loaded?: boolean;
    destroying?: boolean;
    destroyed?: boolean;
}

export interface OgodStateActors<C extends string> {
    [id: string]: OgodStateActor<C>;
}
