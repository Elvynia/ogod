import { makeFeature$ } from "@ogod/game-engine-driver";
import { first, switchMap, tap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureCamera(sources: WorkerSources, state: AppState) {
    return makeFeature$({
        key: 'camera',
        value$: sources.GameEngine.renderTarget$.pipe(
            switchMap((canvas) => sources.GameEngine.action$.getHandler('camera').pipe(
                tap((camera) => {
                    canvas.width = camera.width;
                    canvas.height = camera.height;
                })
            ))
        ),
        target: state
    });
}
