import { mergeMap, Observable } from 'rxjs';

export interface Feature<K extends string = string, T = any> {
    key: K;
    value?: T;
    value$?: Observable<T>;
    remove?: boolean;
}

export interface ComplexFeature {
    mapper: typeof mergeMap;
    value$: Observable<Feature[]>;
}

export type FeatureState<F extends Feature> = {
    [K in Pick<F, 'key'> & string]: Pick<F, 'value'>;
}

export function isComplexFeature(f: any): f is ComplexFeature {
    return f.value$?.subscribe && f.mapper;
}
