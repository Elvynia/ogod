import { b2BodyType, b2PolygonShape } from "@box2d/core";
import { GameBox2dSource } from '@ogod/game-box2d-driver';
import { makeFeature$ } from '@ogod/game-engine-driver';
import { distinctUntilKeyChanged, ignoreElements, merge, of, switchMap, tap } from "rxjs";
import { makePlayer, makePlayerUpdate$ } from "../player/make";
import { AppState, WorkerSources } from "../state";
import { randNum } from "../util";
import { Shape } from "./state";

export function makeShape<R extends Shape = Shape, T extends Omit<R, 'body'> = Omit<R, 'body'>>(
    shape: T, world: GameBox2dSource): T & Pick<Shape, 'body'> {
    const id = shape.id || randNum(8).toString();
    const b2Width = shape.width / (2 * world.scale);
    const b2Height = shape.height / (2 * world.scale);
    const body = world.instance.CreateBody({
        position: {
            x: shape.x / world.scale,
            y: shape.y / world.scale
        },
        type: shape.bodyType,
        angle: shape.angle,
        fixedRotation: shape.fixedRotation || false,
        userData: id
    });
    body.CreateFixture({
        shape: new b2PolygonShape().SetAsBox(b2Width, b2Height),
        density: shape.density || (shape.bodyType === b2BodyType.b2_dynamicBody ? 1 : undefined),
        restitution: 0
    });
    return {
        ...shape,
        body,
        id
    };
}

export function makeShapeUpdate$(sources: WorkerSources) {
    return sources.GameEngine.state$.pipe(
        distinctUntilKeyChanged('shapes'),
        switchMap((state) => {
            const shapes = Object.values(state.shapes)
                .filter((s: any) => s.bodyType === b2BodyType.b2_dynamicBody);
            return sources.GameEngine.update$.pipe(
                tap(() => {
                    shapes.forEach((shape: any) => {
                        shape.x = Math.round(shape.body.GetPosition().x * sources.World.scale);
                        shape.y = Math.round(shape.body.GetPosition().y * sources.World.scale);
                    });
                }),
                ignoreElements()
            )
        })
    )
}

export function makeFeatureShapesPrepare(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'shapes',
        value$: of({
            player: makePlayer(sources.World)
        }),
        target
    });
}

export function makeFeatureShapesUpdate(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'shapes',
        value$: merge(
            makeShapeUpdate$(sources),
            makePlayerUpdate$(sources)
        ),
        target
    });
}
