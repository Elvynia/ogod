import { FeatureKey } from "@ogod/game-engine-driver";
import { filter, first, map, switchMap, tap, withLatestFrom } from "rxjs";
import { AppState, WorkerSources } from "../state";
import { distinctState } from "../util";
import { Camera } from "./state";
import { PHASE } from "../phase/state";

export function makeFeatureCameraResize(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    return {
        key: 'camera',
        publishOnCreate: true,
        publishOnNext: true,
        value$: sources.GameEngine.action$.getHandler('camera').pipe(
            withLatestFrom(sources.GameEngine.renderTarget$, sources.GameEngine.state$),
            map(([{ width, height }, canvas, state]) => {
                canvas.width = width;
                canvas.height = height;
                return {
                    ...state.camera,
                    width,
                    height
                };
            })
        ),
        value: {
            x: 0,
            y: 0
        } as Camera
    };
}

export function makeFeatureCameraUpdate(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    const camera_ = sources.GameEngine.state$.pipe(
        filter((s) => !!s.shapes?.player),
        first(),
        switchMap(({ camera, map: mapState }) => {
            const minY = -mapState.height * mapState.scale / 2;
            const maxX = mapState.width * mapState.scale - camera.width;
            return sources.GameEngine.game$.pipe(
                map(([_, s]) => [s, maxX, minY] as [AppState, number, number])
            );
        })
    ).subscribe(([{ camera, shapes }, maxX, minY]) => {
        // FIXME: Smmoth scrolling by tweening with delta.
        camera.x = Math.min(maxX, Math.max(0, shapes.player.x - camera.width / 2));
        camera.y = Math.min(-minY, Math.max(minY, shapes.player.y - camera.height / 2));
    });
    return {
        key: 'camera',
        value$: sources.GameEngine.state$.pipe(
            distinctState({
                key: 'phase',
                initialValue: PHASE.PLAY
            }),
            first(),
            tap(() => camera_.unsubscribe()),
            map((state) => ({
                ...state.camera,
                x: 0,
                y: 0
            }))
        )
    }
}
