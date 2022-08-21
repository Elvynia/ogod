import { GameEngineSource } from '@ogod/game-engine-driver';
import { distinctUntilChanged, map, switchMap } from 'rxjs';
import { Rect } from './rectangle';
import { AppSize, AppState } from './state';

export const bounceRateChanges = {
    left: 1.1,
    top: 1.2,
    bottom: 1.3,
    right: 1.4,
};

export const baseObjectVelocity = {
    x: 30,
    y: 40,
    maxX: 250,
    maxY: 200,
};

export const updateMovement = (deltaTime, obj: Rect, app: AppSize) => {
    obj.x = Math.round(obj._body.GetPosition().x * app.scale);
    obj.y = Math.round(obj._body.GetPosition().y * app.scale);
};

export const objectUpdateMovement$ = (engine: GameEngineSource<AppState>) => (selection: any[]) =>
    engine.state$.pipe(
        map((state: any) => state.app),
        distinctUntilChanged(),
        switchMap((app) => engine.update$.pipe(
            map((delta) => {
                selection.forEach((o) => updateMovement(delta, o, app));
                return selection;
            })
        )),
        // FIXME: distinctUntilChange should be here to stop republishing state with same object.
    )
