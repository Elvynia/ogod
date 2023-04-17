import { makeFeature$ } from '@ogod/game-engine-driver';
import { concat, concatMap, delay, first, map, of, range, switchMap, tap } from 'rxjs';
import { createNoise2D } from 'simplex-noise';
import { Loading, LoadingState } from '../loading/state';
import { makeCreatePlatform } from '../platform/make';
import { AppState, WorkerSources } from '../state';
import { MapState } from './state';

export function makeFeatureMapLoad(sources: WorkerSources, target: AppState) {
    const loading = {
        progress: 0,
        message: 'Generating map platforms !'
    } as Loading;
    const noise = createNoise2D();
    return makeFeature$({
        key: 'loading',
        value$: concat(
            sources.GameEngine.state$.pipe(
                first(),
                map((state) => state.gmap),
                switchMap((gmap: MapState) => {
                    const makePlatform = makeCreatePlatform(sources.World)
                    return range(0, gmap.width).pipe(
                        concatMap((i) => of(i).pipe(
                            tap((x) => {
                                let y = 0;
                                while (y < gmap.height) {
                                    const value = noise(x, y);
                                    if (value > 0) {
                                        const p = makePlatform(x * gmap.scale, y * gmap.scale, 80, 10);
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
        ).pipe(
            map((l) => ({ map: l } as LoadingState))
        ),
        target,
        remove: true
    });
}
