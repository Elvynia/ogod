export type RenderFunction<S = any> = (delta: number, state: S) => void;

export type RenderState<S = any> = [number, S, RenderFunction<S>];
