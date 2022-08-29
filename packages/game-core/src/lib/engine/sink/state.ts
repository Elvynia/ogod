import { Observable } from 'rxjs';
import { Renderer } from '../../renderer/state';

export interface GameEngineSink {
    runtime$: Observable<any>;
    reflector$?: Observable<(state: Partial<any>) => any>;
    renderer$?: Observable<Renderer>;
}
