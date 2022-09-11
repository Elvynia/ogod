import { makeFeatureArray, makeFeatureObservable } from '@ogod/game-engine-driver';
import { filter, first, map, share, switchMap, takeUntil, withLatestFrom, tap } from 'rxjs';
import { Controls } from '../controls/state';
import { makeFeatureUpdateShapes } from '../shape/make';
import { AppState, WorkerSources } from '../state';

export function makeScenePlay(sources: WorkerSources) {
    const endPlay$ = sources.GameEngine.state$.pipe(
        first(),
        switchMap((state) => sources.GameEngine.update$.pipe(
            filter(() => state.shapes.player.x > state.gmap.width * state.gmap.mapScale - 75),
            first(),
            map(() => state)
        )),
        share()
    );
    return makeFeatureArray<Pick<AppState, 'controls' | 'shapes' | 'paused'>>([
        makeFeatureObservable('controls', sources.GameEngine.actions.controls.pipe(
            takeUntil(endPlay$)
        ), {} as Controls, false),
        makeFeatureUpdateShapes(sources, endPlay$),
        makeFeatureObservable('paused', sources.GameEngine.actions.paused.pipe(
            withLatestFrom(sources.GameEngine.state$.pipe(
                map((s) => s.paused)
            )),
            map(([_, paused]) => !paused),
            takeUntil(endPlay$)
        ), false)
    ]);
}
