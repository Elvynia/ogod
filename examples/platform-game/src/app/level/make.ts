import { makeFeature$ } from '@ogod/game-engine-driver';
import { concat, delayWhen, distinctUntilChanged, filter, first, ignoreElements, map, switchMap, tap } from "rxjs";
import { makeFeatureSceneLoad } from "../scenes/load";
import { makeFeatureScenePlay } from "../scenes/play";
import { AppState, WorkerSources } from "../state";
import { PHASE } from './../phase/state';

export function makeFeatureSceneLevel(sources: WorkerSources, target: AppState) {
    return sources.GameEngine.state$.pipe(
        map((s) => s.gmap.level),
        distinctUntilChanged(),
        switchMap((level) => concat(
            sources.GameEngine.state$.pipe(
                map((s) => s.phase),
                filter((p) => p === PHASE.LOAD),
                first(),
                ignoreElements()
            ),
            makeFeatureSceneLoad(sources, target),
            makeFeatureScenePlay(sources, target),
            makeFeature$({
                key: 'gmap',
                value$: sources.GameEngine.state$.pipe(
                    first(),
                    delayWhen(() => sources.GameEngine.update$.pipe(
                        first()
                    )),
                    map((state) => {
                        // FIXME: Refactor into map next level action.
                        Object.values(state.gmap.platforms).forEach((p) => sources.World.instance.DestroyBody(p.body))
                        sources.World.instance.DestroyBody(state.shapes.player.body);
                        state.gmap.platforms = {};
                        state.gmap.width += 5;
                        ++state.gmap.level;
                        sources.GameEngine.actions.phase.next(PHASE.START);
                        return state.gmap;
                    })
                ),
                target
            })
        ))
    );
}
