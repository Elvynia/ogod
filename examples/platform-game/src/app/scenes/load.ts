import { concat, tap } from 'rxjs';
import { makeFeatureMapLoad } from '../map/make';
import { PHASE } from '../phase/state';
import { makeFeatureShapesPrepare } from '../shape/make';
import { AppState, WorkerSources } from '../state';

export function makeFeatureSceneLoad(sources: WorkerSources, target: AppState) {
    return concat(
        makeFeatureShapesPrepare(sources, target),
        makeFeatureMapLoad(sources, target)
    ).pipe(
        tap({
            complete: () => sources.GameEngine.action$.getHandler('phase').next(PHASE.PLAY)
        })
    )
}
