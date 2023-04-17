import { isEngineActionCanvas } from "@ogod/game-core";
import { makeFeature$ } from "@ogod/game-engine-driver";
import { filter, first, switchMap, tap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureCamera(sources: WorkerSources, state: AppState) {
    return makeFeature$({
        key: 'camera',
        value$: sources.GameEngine.actionHandler.engine.pipe(
            filter(isEngineActionCanvas),
            first(),
            switchMap(({ payload }) => sources.GameEngine.actionHandler.camera.pipe(
                tap((canvas) => {
                    payload.width = canvas.width;
                    payload.height = canvas.height;
                })
            ))
        ),
        target: state
    });
}
