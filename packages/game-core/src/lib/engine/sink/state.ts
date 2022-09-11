import { Observable } from 'rxjs';
import { ReflectState } from '../../reflect/state';
import { RenderState } from '../../render/state';

export interface GameEngineSink<S = any, R = any> {
    feature$: Observable<S>;
    reflect$?: Observable<ReflectState<S, R>>;
    render$?: Observable<RenderState<S>>;
    update$?: Observable<number>;
}
