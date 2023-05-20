import { FeatureKey, makeFeatureObject$, makeFeatureProperty$ } from "@ogod/game-engine-driver";
import { concat, filter, first, of, switchMap, takeUntil, tap } from "rxjs";
import { makeFeatureCameraUpdate } from "../camera/make";
import { makeFeatureMapLoad, makeFeatureMapNext } from "../map/make";
import { makeFeaturePaused } from "../paused/make";
import { PHASE } from '../phase/state';
import { makeFeatureShapesLoad, makeFeatureShapesUpdate } from "../shape/make";
import { AppState, WorkerSources } from "../state";
import { distinctState } from "../util";

export function makeSceneLevel$(sources: WorkerSources) {
    return sources.GameEngine.state$.pipe(
        distinctState({
            key: 'phase'
        }),
        filter((s) => s.phase === PHASE.LOAD),
        switchMap((state) => concat(
            makeFeatureObject$({
                key$: of(
                    makeFeatureShapesLoad(sources),
                    makeFeatureMapLoad(sources)
                ),
                state$: of(state)
            }),
            makeFeatureObject$({
                key$: of(
                    {
                        key: 'phase',
                        publishOnNext: true,
                        value$: of(PHASE.PLAY)
                    } as FeatureKey<AppState, 'phase'>,
                    makeFeatureShapesUpdate(sources),
                    makeFeatureCameraUpdate(sources),
                    makeFeaturePaused(sources)
                ),
                state$: of(state)
            }).pipe(
                takeUntil(sources.GameEngine.game$.pipe(
                    filter(([_, s]) => s.phase === PHASE.PLAY
                        && s.shapes.player.x > s.map.width * s.map.scale - 75),
                    first()
                )),
                tap({
                    complete: () => sources.GameEngine.action$.getHandler('phase').next(PHASE.END)
                })
            ),
            makeFeatureProperty$({
                ...makeFeatureMapNext(sources),
                state
            }),
            makeFeatureProperty$({
                key: 'phase',
                publishOnNext: true,
                value$: of(PHASE.START),
                state
            }),
        ))
    )
}
