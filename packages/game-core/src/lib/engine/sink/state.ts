import { Observable } from 'rxjs';

export interface GameEngineSink {
    runtime$: Observable<any>;
    reflector$?: Observable<(state: Partial<any>) => any>;
    renderer$?: Observable<(delta: number, state: any) => void>;
}
