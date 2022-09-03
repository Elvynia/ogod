import { isEngineActionCanvas } from "@ogod/game-core";
import { makeFeatureObservable } from "@ogod/game-engine-driver";
import { filter, first, switchMap, tap } from "rxjs";
import { Screen, WorkerSources } from "./state";

export function makeFeatureScreen(engine: WorkerSources['GameEngine'], initValue?: Screen) {
    return makeFeatureObservable('screen', engine.actions.engine.pipe(
        filter(isEngineActionCanvas),
        first(),
        switchMap(({ payload }) => engine.actions.screen.pipe(
            tap((app) => {
                payload.width = app.width;
                payload.height = app.height;
            })
        ))
    ), initValue);
}
