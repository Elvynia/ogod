import { Observable } from 'rxjs';
import { FeatureState } from '../feature/state';

export type RuntimeState<S extends FeatureState> = {
    [K in keyof S]: S[K];
} & {
    [G in keyof S as `${G & string}$`]: Observable<S[G]>;
}
