import { merge, Observable } from 'rxjs';

export interface Feature<S = any, K extends keyof S = keyof S, T = S[K]> {
    key: K;
    value?: T;
    value$?: Observable<T>;
    remove?: boolean;
}

export interface FeatureArray<S = any> {
    values: Feature<S>[];
    factory$: typeof merge;
}

export function isFeatureArray(f: any): f is FeatureArray {
    return f.values && Array.isArray(f.values) && f.factory$ && typeof f.factory$ === 'function';
}
