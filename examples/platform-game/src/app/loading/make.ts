import { FeatureKey, makeFeatureObject$ } from "@ogod/game-engine-driver";
import { of } from "rxjs";
import { AppState, WorkerSources } from "../state";
import { LoadingState } from "./state";

export function makeFeatureLoading(sources: WorkerSources): FeatureKey<AppState, 'loading'> {
    return {
        key: 'loading',
        publishOnNext: true,
        value$: makeFeatureObject$({
            key$: sources.GameEngine.action$.getHandler('loading'),
            state$: of({} as LoadingState)
        })
    }
}