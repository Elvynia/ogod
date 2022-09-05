import { RuntimeState } from "../runtime/state";

export type ReflectFunction<S = any, R = any> = (state: Partial<S>) => R;

export type ReflectState<S = any, R = any> = RuntimeState<ReflectFunction<S, R>>;
