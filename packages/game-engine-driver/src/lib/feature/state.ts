import { Observable } from 'rxjs';

export interface Feature<S = any, K extends keyof S = keyof S, T = S[K]> {
    key: K;
    target?: S;
    remove?: boolean;
    value$: Observable<T>;
}
