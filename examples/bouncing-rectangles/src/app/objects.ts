import { b2World } from '@box2d/core';
import { GameEngineSource } from '@ogod/game-engine-driver';
import { concat, map, of, takeWhile, tap } from 'rxjs';
import { CreateRectFn, Rect } from './rectangle';
import { AppSize, AppState, ObjectState } from './state';

export const updateMovement = (_, obj: Rect, app: AppSize) => {
    obj.x = Math.round(obj.body.GetPosition().x * app.scale);
    obj.y = Math.round(obj.body.GetPosition().y * app.scale);
    return obj.x < 0 || obj.x > app.width || obj.y < 0 || obj.y > app.height;
};

export function makeAddRandomRect$(engine: GameEngineSource<AppState>, createRect: CreateRectFn, world: b2World, objects: ObjectState,
    app: AppSize) {
    return (x, y) => {
        const rect = createRect(x, app.height - y);
        objects[rect.id] = rect;
        return concat(
            of(objects),
            engine.update$.pipe(
                takeWhile((delta) => rect.health > 0 && !updateMovement(delta, rect, app)),
                tap({
                    complete: () => {
                        world.DestroyBody(rect.body);
                        delete objects[rect.id];
                    }
                }),
                map(() => objects)
            ),
            of(objects)
        );
    }
}
