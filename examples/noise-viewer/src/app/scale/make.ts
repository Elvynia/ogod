import { FeatureKey } from "@ogod/game-engine-driver";
import { AppState, WorkerSources } from "../state";

export function makeFeatureScale(sources: WorkerSources): FeatureKey<AppState, 'scale'> {
    return {
        key: 'scale',
        publishOnNext: true,
        value$: sources.GameEngine.action$.getHandler('scale')
    };
}
