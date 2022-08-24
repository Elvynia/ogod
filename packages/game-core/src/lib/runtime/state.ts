import { Observable } from 'rxjs';
import { FeatureState } from '../feature/state';

export type RuntimeState<S extends FeatureState> = {
    [K in keyof S]: Observable<S[K]>;
}
