import { RuntimeState } from '../runtime/state';

export type RenderFunction<S = any> = (delta: number, state: S) => void;

export type RenderState<S = any> = RuntimeState<RenderFunction<S>>;
