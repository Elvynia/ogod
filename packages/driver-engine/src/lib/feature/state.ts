import { Observable, Subscription } from 'rxjs';

export interface FeatureObservable<T> {
    publishOnCreate?: boolean;
    publishOnComplete?: boolean;
    publishOnNext?: boolean;
    value$: Observable<T>;
    value?: T;
    subscriptions?: Subscription[];
}

export interface FeatureGroupObservable<T, P extends Partial<T> = Partial<T>> extends FeatureObservable<P> {
    publishOnComplete?: false;
}

export interface FeatureGroupCompletable<
    T,
    K extends keyof T = keyof T,
    P extends Pick<T, K> = Pick<T, K>
> extends FeatureObservable<P> {
    keys: Array<K>;
    publishOnComplete?: true;
}

export type FeatureGroup<T extends object> = FeatureGroupObservable<T> | FeatureGroupCompletable<T>;

export interface FeatureKey<T extends object, K extends keyof T = keyof T> extends FeatureObservable<T[K]> {
    key: K;
}

export type FeatureKeys<T extends object> = {
    [K in keyof T]: FeatureKey<T, K>;
}[keyof T];

export type FeatureProperty<T extends object> = (FeatureGroup<T> | FeatureKeys<T>) & {
    state: T;
}

export interface FeatureObject<T extends object> {
    key$: Observable<FeatureGroup<T> | FeatureKeys<T>>;
    publishOnCreate?: boolean;
    state: T | Observable<T>;
    subscriptions?: Subscription[];
}

export function isFeatureKey<T extends object>(f: any): f is FeatureKey<T, typeof f['key']> {
    return typeof f === 'object' && f.value$ && f.key;
}
