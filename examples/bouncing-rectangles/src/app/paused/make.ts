import { FeatureKey } from "@ogod/driver-engine";
import { AppState, WorkerSources } from "../state";

export function makeFeaturePaused(sources: WorkerSources): FeatureKey<AppState, 'paused'> {
    return {
        key: 'paused',
        publishOnNext: true,
        value$: sources.Engine.action$.getHandler('paused')
    };
}
