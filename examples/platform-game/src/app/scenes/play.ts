import { makeFeature$ } from '@ogod/game-engine-driver';
import { delay, filter, first, map, merge, share, startWith, switchMap, takeUntil, withLatestFrom } from 'rxjs';
import { makeFeatureUpdateShapes } from '../shape/make';
import { AppState, WorkerSources } from '../state';

export function makeScenePlay(sources: WorkerSources, target: AppState) {
    const endPlay$ = sources.GameEngine.state$.pipe(
        first(),
        delay(1000),
        switchMap((state) => sources.GameEngine.update$.pipe(
            filter(() => state.shapes.player.x > state.gmap.width * state.gmap.mapScale - 75),
            first(),
            map(() => state)
        )),
        share()
    );
    target.shapes.player.body.SetTransformVec({ x: 50 / target.gmap.scale, y: 525 / target.gmap.scale }, 0);
    target.shapes.player.body.SetLinearVelocity({ x: 0, y: 0 });
    return merge(
        makeFeature$({
            key: 'controls',
            value$: sources.GameEngine.actions.controls.pipe(
                startWith({})
            ),
            target,
            remove: true
        }),
        makeFeatureUpdateShapes(sources, target),
        makeFeature$({
            key: 'paused',
            value$: sources.GameEngine.actions.paused.pipe(
                withLatestFrom(sources.GameEngine.state$.pipe(
                    map((s) => s.paused)
                )),
                map(([_, paused]) => !paused)
            ),
            target
        })
    ).pipe(
        takeUntil(endPlay$)
    );
}
