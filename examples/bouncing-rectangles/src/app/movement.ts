import { GameEngineSource } from '@ogod/game-engine-driver';
import { map, switchMap, distinctUntilChanged, tap } from 'rxjs';
import { AppState } from './state';
import { clampMag, runBoundaryCheck } from './util';

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

export const updateMovement = (deltaTime, obj, width, height) => {
    obj.x = obj.x += obj.velocity.x * deltaTime;
    obj.y = obj.y += obj.velocity.y * deltaTime;
    const didHit = runBoundaryCheck(obj, width, height);
    if (didHit) {
        if (didHit === 'right' || didHit === 'left') {
            obj.velocity.x *= -bounceRateChanges[didHit];
        } else {
            obj.velocity.y *= -bounceRateChanges[didHit];
        }
    }
    obj.velocity.x = clampMag(obj.velocity.x, 0, baseObjectVelocity.maxX);
    obj.velocity.y = clampMag(obj.velocity.y, 0, baseObjectVelocity.maxY);
};

export const selectorMovement = (objects: any[]) => objects.filter((o) => o.velocity);

export const objectUpdateMovement$ = (engine: GameEngineSource<AppState>) => (selection: any[]) =>
    engine.state$.pipe(
        map((state: any) => state.app),
        distinctUntilChanged(),
        switchMap(({ width, height }) => engine.update$.pipe(
            map((delta) => {
                selection.forEach((o) => updateMovement(delta, o, width, height));
                return selection;
            })
        )),
        // FIXME: distinctUntilChange should be here to stop republishing state with same object.
    )
