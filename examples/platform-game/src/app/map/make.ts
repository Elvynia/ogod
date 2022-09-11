import { makeFeatureObservable } from '@ogod/game-engine-driver';
import { concat, concatMap, delay, first, map, of, range, switchMap, tap, timer, ignoreElements } from 'rxjs';
import { createNoise2D } from 'simplex-noise';
import { Loading, LoadingState } from '../loading/state';
import { makeCreatePlatform } from '../platform/make';
import { WorkerSources } from '../state';
import { MapState } from './state';

export function makeFeatureLoadMap(sources: WorkerSources) {
    const loading = {
        progress: 0,
        message: 'Generating map platforms !'
    } as Loading;
    const noise = createNoise2D();
    return makeFeatureObservable('loading', concat(
        sources.GameEngine.state$.pipe(
            first(),
            map((state) => state.gmap),
            switchMap((gmap: MapState) => {
                const makePlatform = makeCreatePlatform(sources.World.instance, gmap.scale)
                return range(0, gmap.width).pipe(
                    concatMap((i) => of(i).pipe(
                        tap((x) => {
                            let y = 0;
                            while (y < gmap.height) {
                                const value = noise(x, y);
                                if (value > 0) {
                                    const p = makePlatform(x * gmap.mapScale, y * gmap.mapScale, 100, 10);
                                    gmap.platforms[p.id] = p;
                                }
                                ++y;
                            }
                        }),
                        map((i) => ({ ...loading, progress: i / 100 })),
                        delay(30)
                    ))
                )
            })
        ),
        of({ ...loading, progress: 1 }),
        // timer(16).pipe(ignoreElements())
    ).pipe(
        map((l) => ({ map: l } as LoadingState))
    ), { map: loading } as LoadingState);
}
