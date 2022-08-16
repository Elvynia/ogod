import { FeatureState } from '@ogod/game-engine-driver';
import { Observable } from 'rxjs';

export type RuntimeState<S extends FeatureState> = {
    [K in keyof S]: Observable<S[K]>;
}
