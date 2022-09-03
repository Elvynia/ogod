import { mergeMap, Observable } from 'rxjs';

export interface Feature<K extends string = string, T = any> {
    key: K;
    value?: T;
    value$?: Observable<T>;
    remove?: boolean;
}

export interface ComplexFeature<K extends string = string> {
    mapper: typeof mergeMap;
    value$: Observable<Feature<K>[]>;
}

export type FeatureState<K extends string> = {
    [G in K]: any;
}

export function isComplexFeature(f: any): f is ComplexFeature {
    return f.value$?.subscribe && f.mapper;
}
