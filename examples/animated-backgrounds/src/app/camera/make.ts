import { isEngineActionCanvas } from "@ogod/game-core";
import { makeFeature$ } from "@ogod/game-engine-driver";
import { filter, first, switchMap, tap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureCamera(sources: WorkerSources, state: AppState) {
    return makeFeature$({
        key: 'camera',
        value$: sources.GameEngine.action$.handlers.engine.pipe(
            filter(isEngineActionCanvas),
            first(),
            switchMap(({ payload }) => sources.GameEngine.action$.handlers.camera.pipe(
                tap((app) => {
                    payload.width = app.width;
                    payload.height = app.height;
                })
            ))
        ),
        target: state
    });
}
