import { Observable } from 'rxjs';
import { ReflectState } from '../../reflector/state';
import { RenderState } from '../../renderer/state';

export type GameEngineSink<S = any, R = any> = Record<'feature$', Observable<S>>
    & Record<'reflect$', Observable<ReflectState<S, R>>>
    & Record<'render$', Observable<RenderState<S>>>;
