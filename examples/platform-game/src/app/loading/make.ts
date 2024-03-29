import { FeatureKey, makeStateObject } from "@ogod/driver-engine";
import { AppState, WorkerSources } from "../state";
import { LoadingState } from "./state";

export function makeFeatureLoading(sources: WorkerSources): FeatureKey<AppState, 'loading'> {
    return {
        key: 'loading',
        publishOnNext: true,
        value$: makeStateObject({
            publishOnCreate: true,
            key$: sources.Engine.action$.getHandler('loading'),
            state: {} as LoadingState
        })
    }
}
