import { Feature } from '@ogod/game-core';
import { makeFeatureObservable } from '@ogod/game-engine-driver';
import gsap, { Bounce, Linear } from 'gsap';
import { filter, first, from, mergeMap, range, switchMap } from 'rxjs';
import { makeSleet, makeSleetBounce$ } from '../sleet/make';
import { AppState, WorkerSources } from '../state';

export function makeSplashScene(sources: WorkerSources): Feature[] {
    const splash = {};
    return [
        makeFeatureObservable('splash', sources.GameEngine.state$.pipe(
            filter((s) => s.camera),
            first(),
            switchMap((state: AppState) => {
                const sleetBounce$ = makeSleetBounce$(state);
                return range(1, state.camera.width / 100 - 1).pipe(
                    mergeMap((x) => range(1, state.camera.height / 100 - 1).pipe(
                        mergeMap((y) => sleetBounce$(x * 100, y * 100))
                    ))
                )
            })
        ), splash)
    ]
}
