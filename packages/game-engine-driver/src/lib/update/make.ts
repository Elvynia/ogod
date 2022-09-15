import { GameEngineSource } from "@ogod/game-core";
import { map, pairwise, share } from "rxjs";

export function makeUpdate$(engine: GameEngineSource) {
    return engine.frame$.pipe(
        pairwise(),
        map(([prev, cur]) => cur.elapsed - prev.elapsed),
        share()
    );
}
