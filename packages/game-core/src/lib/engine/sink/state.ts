import { Observable } from 'rxjs';
import { ReflectFunction } from '../../reflector/state';
import { Renderer } from '../../renderer/state';

export interface GameEngineSink<S = any> {
    runtime$: Observable<S>;
    reflector$?: Observable<ReflectFunction>;
    renderer$?: Observable<Renderer<S>>;
}
