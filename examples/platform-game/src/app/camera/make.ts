import { FeatureKey } from "@ogod/driver-engine";
import { filter, first, ignoreElements, map, switchMap, tap } from "rxjs";
import { AppState, WorkerSources } from "../state";
import { Camera } from "./state";

export function makeFeatureCameraResize(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    const value = {
        x: 0,
        y: 0
    } as Camera;
    return {
        key: 'camera',
        publishOnCreate: true,
        publishOnNext: true,
        value$: sources.Engine.action$.getHandler('camera').pipe(
            map((payload) => {
                Object.assign(value, payload);
                return value;
            })
        ),
        value
    };
}

// FIXME: use system$
export function makeFeatureCameraUpdate(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    return {
        key: 'camera',
        value$: sources.Engine.state$.pipe(
            filter((s) => !!s.shapes?.player),
            first(),
            switchMap(({ camera, map: mapState, shapes }) => {
                const minY = -mapState.height * mapState.scale / 2;
                const maxX = mapState.width * mapState.scale - camera.width;
                return sources.Engine.engine$.pipe(
                    tap(() => {
                        // FIXME: Smmoth scrolling by tweening with delta.
                        camera.x = Math.min(maxX, Math.max(0, shapes.player.x - camera.width / 2));
                        camera.y = Math.min(-minY, Math.max(minY, shapes.player.y - camera.height / 2));
                    }),
                    ignoreElements()
                );
            })
        )
    }
}
