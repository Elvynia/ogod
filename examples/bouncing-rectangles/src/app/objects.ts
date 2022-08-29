import { b2World } from '@box2d/core';
import { GameEngineSource } from '@ogod/game-core';
import { concat, map, of, takeWhile, tap } from 'rxjs';
import { CreateRectFn, Rect } from './rectangle';
import { AppSize, ObjectState } from './state';

export const updateMovement = (_, obj: Rect, app: AppSize) => {
    const pos = obj.body.GetPosition();
    const newPos = pos.Clone();
    const appWidth = app.width / app.scale;
    const appHeight = app.height / app.scale;
    if (pos.x < 0) {
        newPos.Set(pos.x + appWidth, appHeight - pos.y);
    } else if (pos.x > appWidth) {
        newPos.Set(pos.x - appWidth, appHeight - pos.y);
    }
    if (pos.y < 0) {
        newPos.Set(appWidth - newPos.x, pos.y + appHeight);
    } else if (pos.y > appHeight) {
        newPos.Set(appWidth - newPos.x, pos.y - appHeight);
    }
    if (pos.x !== newPos.x || pos.y !== newPos.y) {
        obj.body.SetTransformVec(newPos, 0);
    }
    obj.x = Math.round(obj.body.GetPosition().x * app.scale);
    obj.y = Math.round(obj.body.GetPosition().y * app.scale);
};

export function makeAddRandomRect$(engine: GameEngineSource, createRect: CreateRectFn, world: b2World, objects: ObjectState,
    app: AppSize) {
    return (x, y) => {
        const rect = createRect(x, app.height - y);
        objects[rect.id] = rect;
        return concat(
            of(objects),
            engine.update$.pipe(
                takeWhile((delta) => rect.health > 0),
                tap({
                    next: (delta) => updateMovement(delta, rect, app),
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
