import { filter, first, merge, switchMap, takeUntil, tap } from 'rxjs';
import { makeFeatureCameraUpdate } from '../camera/make';
import { makeFeatureControls } from '../controls/make';
import { makeFeaturePaused } from '../paused/make';
import { PHASE } from '../phase/state';
import { makeFeatureShapesUpdate } from '../shape/make';
import { AppState, WorkerSources } from '../state';

export function makeFeatureScenePlay(sources: WorkerSources, target: AppState) {
    return merge(
        makeFeatureControls(sources, target),
        makeFeatureShapesUpdate(sources, target),
        makeFeatureCameraUpdate(sources, target),
        makeFeaturePaused(sources, target)
    ).pipe(
        takeUntil(sources.GameEngine.state$.pipe(
            first(),
            // delay(1000),
            switchMap((state) => sources.GameEngine.game$.pipe(
                filter(() => state.shapes.player.x > state.gmap.width * state.gmap.scale - 75),
                first(),
                tap(() => sources.GameEngine.actionHandler.phase.next(PHASE.END))
            ))
        ))
    );
}
