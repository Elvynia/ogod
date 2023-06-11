import { FeatureKey } from "@ogod/driver-engine";
import { Observable, filter, first, switchMap, tap } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureCamera(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    return {
        key: 'camera',
        publishOnNext: true,
        value$: sources.Engine.target$.pipe(
            switchMap((canvas) => sources.Engine.action$.getHandler('camera').pipe(
                tap((camera) => {
                    canvas.width = camera.width;
                    canvas.height = camera.height;
                })
            ))
        )
    };
}

export function waitForCamera(sources: WorkerSources): Observable<AppState> {
    return sources.Engine.state$.pipe(
        filter((state) => !!state.camera),
        first()
    );
}
