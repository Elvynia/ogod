import { GameEngineSource } from "@ogod/game-core";
import { buffer, filter, map } from "rxjs";

export function makeReflect$(engine: GameEngineSource) {
    return engine.state$.pipe(
        buffer(engine.frame$),
        map((states) => states.pop()),
        filter((state) => !!state)
    );
}
