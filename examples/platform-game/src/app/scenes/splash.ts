import { Feature } from '@ogod/game-core';
import { makeFeatureObservable } from '@ogod/game-engine-driver';
import { filter, first, ignoreElements, mergeMap, range, switchMap, timer } from 'rxjs';
import { makeSleet } from '../sleet/make';
import { AppState, WorkerSources } from '../state';

export function makeSplashScene(sources: WorkerSources): Feature[] {
    const splash = {};
    return [
        makeFeatureObservable('splash', sources.GameEngine.state$.pipe(
            filter((s) => s.camera),
            first(),
            switchMap((state: AppState) => range(0, state.camera.width / 100).pipe(
                mergeMap((x) => range(0, state.camera.height / 100).pipe(
                    mergeMap((y) => {
                        const sleet = makeSleet(x * 100, y * 100);
                        state.splash[sleet.id] = sleet;
                        return timer(1000).pipe(
                            ignoreElements()
                        );
                    })
                ))
            ))
        ), splash)
    ]
}
