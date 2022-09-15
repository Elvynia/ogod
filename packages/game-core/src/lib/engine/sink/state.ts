import { Observable } from 'rxjs';
import { RenderState } from '../../render/state';

export interface GameEngineSink<S = any, R = any> {
    feature$: Observable<S>;
    reflect$?: Observable<R>;
    render$?: Observable<RenderState<S>>;
    update$?: Observable<number>;
}
