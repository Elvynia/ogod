import { Observable } from 'rxjs';

export type RenderFunction = (delta: number, state: any) => void;

export interface Renderer {
    render: RenderFunction;
    observable?: Observable<any>;
}
