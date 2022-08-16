import { GameEngineSource } from '@ogod/game-engine-driver';
import { distinctUntilChanged, distinctUntilKeyChanged, filter, first, map, merge, of, pairwise, startWith, switchMap, tap } from 'rxjs';
import { objectUpdateMovement$, selectorMovement } from './movement';
import { AppState } from './state';

const objectUpdates$ = (engine: GameEngineSource<AppState>) => merge(
    engine.state$.pipe(
        map((state: any) => state.objects),
        distinctUntilChanged(),
        // tap((objects) => console.log('Objects array has changed !', objects)),
        switchMap((objects: any[]) => objectUpdateMovement$(engine)(selectorMovement(objects)).pipe(map(() => objects)))
    ),
    engine.actions.objects.pipe(
        switchMap((obj) => engine.state$.pipe(
            first(),
            map((state) => [...state.objects, obj])
        ))
    )
);

export function makeFeatureObjects(engine: GameEngineSource<AppState>) {
    return engine.state$.pipe(
        distinctUntilKeyChanged('paused'),
        pairwise(),
        filter(([a, b]) => a.paused !== b.paused),
        tap(([_, state]) =>
            state.objects.forEach((obj) => {
                let newColor = obj.toggleColor;
                obj.toggleColor = obj.color;
                obj.color = newColor;
            })
        ),
        startWith([undefined, engine.state$.value]),
        switchMap(([_, b]) => (b.paused ? of(b.objects) : objectUpdates$(engine)))
    );
}
