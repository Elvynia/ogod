import { concat, map, Observable, of, range, delay, concatMap, tap } from 'rxjs';
import { Loading } from '../loading/state';
import { createNoise2D } from 'simplex-noise';

export function makeGenerateMap$(width: number, height: number): Observable<Loading> {
    const loading = {
        progress: 0,
        message: 'Generating map platforms !'
    }
    const noise = createNoise2D();
    return concat(
        range(0, width).pipe(
            concatMap((x) => of(x).pipe(
                tap((x) => {
                    let y = 0;
                    while (y < height) {
                        const value = noise(x, y);
                        console.log(x, y, value);
                        ++y;
                    }
                }),
                delay(16),
                map((i) => ({ ...loading, progress: i / 100 }))
            ))
        ),
        of({ ...loading, progress: 1 })
    )
}
