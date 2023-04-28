import { makeFeature$ } from "@ogod/game-engine-driver";
import { AppState, WorkerSources } from "../state";

export function makeFeatureScale(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'scale',
        value$: sources.GameEngine.action$.getHandler('scale').asObservable(),
        target
    })
}
