import { makeFeatureArray, makeFeatureConstant, makeFeatureObservable } from "@ogod/game-engine-driver";
import { concat, delayWhen, distinctUntilChanged, first, map, startWith } from "rxjs";
import { makeSceneLoad } from "../scenes/intro";
import { makeScenePlay } from "../scenes/play";
import { makeSceneStart } from "../scenes/start";
import { WorkerSources } from "../state";

export function makeLevel(sources: WorkerSources, index: number = 0) {
    return makeFeatureArray([
        makeSceneStart(sources),
        makeSceneLoad(sources),
        makeScenePlay(sources),
        makeFeatureArray([
            makeFeatureConstant('initialized', false),
            makeFeatureConstant('loaded', false),
            makeFeatureConstant('start', false),
            makeFeatureObservable('gmap', sources.GameEngine.state$.pipe(
                first(),
                delayWhen(() => sources.GameEngine.update$.pipe(
                    first()
                )),
                map((s) => {
                    ++s.gmap.level;
                    return s.gmap;
                })
            ), undefined, false)
        ])
    ], concat);
}

export function makeLevel$(sources: WorkerSources) {
    return sources.GameEngine.state$.pipe(
        map((s) => s.gmap.level),
        startWith(0),
        distinctUntilChanged(),
        map((level) => makeLevel(sources, level))
    )
}
