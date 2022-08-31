import { Observable } from 'rxjs';
import { ReflectFunction } from '../../reflector/state';
import { Renderer } from '../../renderer/state';

export interface GameEngineSink {
    runtime$: Observable<any>;
    reflector$?: Observable<ReflectFunction>;
    renderer$?: Observable<Renderer>;
}
