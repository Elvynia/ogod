import { makeFeatureObservable } from "@ogod/game-engine-driver";
import { mergeMap } from "rxjs";
import { BallState, makeRandomBall$ } from "./ball";
import { WorkerSources } from './state';

export function makeFeatureObjects(engine: WorkerSources['GameEngine'], objects: BallState = {}) {
    const randomBall$ = makeRandomBall$(engine.actions.reset, objects);
    return makeFeatureObservable('objects', engine.actions.objects.pipe(
        mergeMap(({ x, y }) => randomBall$(x, y))
    ), objects);
}
