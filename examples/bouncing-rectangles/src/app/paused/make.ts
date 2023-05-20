import { FeatureKey } from "@ogod/game-engine-driver";
import { AppState, WorkerSources } from "../state";

export function makeFeaturePaused(sources: WorkerSources): FeatureKey<AppState, 'paused'> {
    return {
        key: 'paused',
        publishOnNext: true,
        value$: sources.GameEngine.action$.getHandler('paused')
    };
}