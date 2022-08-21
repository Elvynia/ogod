import { GameEngineSource } from '@ogod/game-engine-driver';
import { distinctUntilChanged, distinctUntilKeyChanged, first, map, merge, of, skip, startWith, switchMap, tap } from 'rxjs';
import { objectUpdateMovement$ } from './movement';
import { AppState } from './state';

const objectUpdates$ = (engine: GameEngineSource<AppState>, app, addRect) => merge(
    engine.state$.pipe(
        map((state: any) => state.objects),
        distinctUntilChanged(), // FIXME: Put before map
        // tap((objects) => console.log('Objects array has changed !', objects)),
        switchMap((objects: any[]) => objectUpdateMovement$(engine)(objects).pipe(
            map(() => objects),
            distinctUntilChanged()
        ))
    ),
    engine.action$.objects.pipe(
        switchMap(({ x, y }) => engine.state$.pipe(
            first(),
            map((state) => [...state.objects, addRect(x, app.height - y)])
        ))
    )
);

export function makeFeatureObjects(engine: GameEngineSource<AppState>, addRect) {
    return engine.state$.pipe(
        first(),
        switchMap((initState) => engine.state$.pipe(
            distinctUntilKeyChanged('paused'),
            skip(1),
            tap((state) => {
                state.objects.forEach((obj) => {
                    // let newColor = obj.toggleColor;
                    // obj.toggleColor = obj.color;
                    // obj.color = newColor;
                });
            }),
            startWith(initState),
            switchMap((state) => (state.paused ? of(state.objects) : objectUpdates$(engine, state.app, addRect)))
        )),
    );
}
