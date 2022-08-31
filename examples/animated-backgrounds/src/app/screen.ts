import { GameEngineSource, isEngineActionCanvas } from "@ogod/game-core";
import { makeFeatureObservable } from "@ogod/game-engine-driver";
import { filter, first, switchMap, tap } from "rxjs";
import { Screen } from "./state";

export function makeFeatureScreen(engine: GameEngineSource, initValue?: Screen) {
    return makeFeatureObservable('screen', engine.action$.engine.pipe(
        filter(isEngineActionCanvas),
        first(),
        switchMap(({ payload }) => engine.action$.screen.pipe(
            tap((app) => {
                payload.width = app.width;
                payload.height = app.height;
            })
        ))
    ), initValue);
}
