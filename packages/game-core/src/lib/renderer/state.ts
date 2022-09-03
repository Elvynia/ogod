import { Observable } from 'rxjs';

export type RenderFunction<S = any> = (delta: number, state: S) => void;

export interface Renderer<S = any> {
    render: RenderFunction<S>;
    observable?: Observable<any>;
}
