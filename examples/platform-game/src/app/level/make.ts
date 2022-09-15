import { makeFeature$ } from '@ogod/game-engine-driver';
import { concat, delayWhen, distinctUntilChanged, first, map, switchMap } from "rxjs";
import { makeSceneLoad } from "../scenes/intro";
import { makeScenePlay } from "../scenes/play";
import { makeSceneStart } from "../scenes/start";
import { AppState, WorkerSources } from "../state";

export function makeLevel$(sources: WorkerSources, target: AppState) {
    return sources.GameEngine.state$.pipe(
        map((s) => s.gmap.level),
        distinctUntilChanged(),
        switchMap((level) => concat(
            makeSceneStart(sources, target),
            makeSceneLoad(sources, target),
            makeScenePlay(sources, target),
            makeFeature$({
                key: 'gmap',
                value$: sources.GameEngine.state$.pipe(
                    first(),
                    delayWhen(() => sources.GameEngine.update$.pipe(
                        first()
                    )),
                    map((state) => {
                        state.initialized = false;
                        state.loaded = false;
                        state.start = false;
                        state.gmap.width += 5;
                        ++state.gmap.level;
                        return state.gmap;
                    })
                ),
                target
            })
        ))
    );
}
