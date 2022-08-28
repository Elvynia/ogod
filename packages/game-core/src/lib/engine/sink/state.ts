import { Observable } from 'rxjs';
import { FeatureState } from '../../feature/state';
import { RuntimeState } from '../../runtime/state';

export interface GameEngineSink<S extends FeatureState, R = any> {
    runtime$: Observable<RuntimeState<S>>;
    reflector$?: Observable<(state: Partial<S>) => R>;
    renderer$?: Observable<(delta: number, state: S) => void>;
}
