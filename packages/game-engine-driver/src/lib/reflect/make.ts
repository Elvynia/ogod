import { ActionState, GameEngineSource } from "@ogod/game-core";
import { buffer, filter, map } from "rxjs";

export function makeReflect$<S = any, A extends string = any, R = any,
    AS extends ActionState<A> = ActionState<A>>(engine: GameEngineSource<S, A, R, AS>) {
    return engine.state$.pipe(
        buffer(engine.frame$),
        map((states) => states.pop()),
        filter((state) => !!state)
    );
}
