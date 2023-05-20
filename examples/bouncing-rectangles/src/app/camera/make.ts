import { FeatureKey } from "@ogod/game-engine-driver";
import { Observable, filter, first, switchMap, tap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureCamera(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    return {
        key: 'camera',
        publishOnNext: true,
        value$: sources.GameEngine.renderTarget$.pipe(
            switchMap((canvas) => sources.GameEngine.action$.getHandler('camera').pipe(
                tap((camera) => {
                    canvas.width = camera.width;
                    canvas.height = camera.height;
                })
            ))
        )
    };
}

export function waitForCamera(sources: WorkerSources): Observable<AppState> {
    return sources.GameEngine.state$.pipe(
        filter((state) => !!state.camera),
        first()
    );
}
