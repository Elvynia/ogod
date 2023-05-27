import { FeatureKey, makeStateObject } from "@ogod/game-engine-driver";
import { AppState, WorkerSources } from "../state";
import { LoadingState } from "./state";

export function makeFeatureLoading(sources: WorkerSources): FeatureKey<AppState, 'loading'> {
    return {
        key: 'loading',
        publishOnNext: true,
        value$: makeStateObject({
            key$: sources.GameEngine.action$.getHandler('loading'),
            state: {} as LoadingState
        })
    }
}