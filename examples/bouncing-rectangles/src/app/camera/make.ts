import { FeatureKey } from "@ogod/driver-engine";
import { Observable, filter, first } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureCamera(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    return {
        key: 'camera',
        publishOnNext: true,
        value$: sources.Engine.action$.getHandler('camera')
    };
}

export function waitForCamera(sources: WorkerSources): Observable<AppState> {
    return sources.Engine.state$.pipe(
        filter((state) => !!state.camera),
        first()
    );
}
