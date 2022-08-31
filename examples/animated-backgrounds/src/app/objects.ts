import { GameEngineSource } from "@ogod/game-core";
import { makeFeatureObservable } from "@ogod/game-engine-driver";
import { mergeMap } from "rxjs";
import { BallState, makeRandomBall$ } from "./ball";

export function makeFeatureObjects(engine: GameEngineSource, objects: BallState = {}) {
    const randomBall$ = makeRandomBall$(engine.action$.reset, objects);
    return makeFeatureObservable('objects', engine.action$.objects.pipe(
        mergeMap(({ x, y }) => randomBall$(x, y))
    ), objects);
}
