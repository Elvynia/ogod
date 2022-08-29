import { Feature } from '@ogod/game-core';
import { makeFeatureObservable } from '@ogod/game-engine-driver';
import { concat, first, map, of, range, switchMap, tap, timer, concatMap, delay } from 'rxjs';
import { createNoise2D } from 'simplex-noise';
import { LoadingState } from '../loading/state';
import { makeCreatePlatform } from '../platform/make';
import { WorkerSources } from '../state';
import { MapState } from './state';

export function makeFeatureLoadMap$(sources: WorkerSources): Feature<'loading', LoadingState> {
    const loading = {
        progress: 0,
        message: 'Generating map platforms !'
    }
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
                                    const p = makePlatform(x * 100, y * 100, 100, 10);
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
        timer(16).pipe(map(() => null))
    ).pipe(
        map((l) => ({ map: l }))
    ), { map: loading });
}
