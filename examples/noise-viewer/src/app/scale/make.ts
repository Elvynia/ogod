import { FeatureKey } from "@ogod/driver-engine";
import { AppState, WorkerSources } from "../state";

export function makeFeatureScale(sources: WorkerSources): FeatureKey<AppState, 'scale'> {
    return {
        key: 'scale',
        publishOnNext: true,
        value$: sources.GameEngine.action$.getHandler('scale')
    };
}
