import { b2BodyType, b2PolygonShape } from "@box2d/core";
import { Box2dSource } from '@ogod/driver-box2d';
import { FeatureKey, makeStateObject } from "@ogod/driver-engine";
import { first, map, of } from "rxjs";
import { AppState, WorkerSources } from "../state";
import { randNum } from "../util";
import { makeFeaturePlayer, makePlayer } from "./player/make";
import { Shape } from "./state";

export function makeShape<R extends Shape = Shape, T extends Omit<R, 'body'> = Omit<R, 'body'>>(
    shape: T, world: Box2dSource): T & Pick<Shape, 'body'> {
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

export function makeFeatureShapesLoad(sources: WorkerSources): FeatureKey<AppState, 'shapes'> {
    return {
        key: 'shapes',
        publishOnNext: true,
        value$: of({
            player: makePlayer(sources.World)
        })
    }
}

export function makeFeatureShapesUpdate(sources: WorkerSources): FeatureKey<AppState, 'shapes'> {
    return {
        key: 'shapes',
        publishOnNext: true,
        value$: makeStateObject({
            key$: makeFeaturePlayer(sources),
            state: sources.Engine.state$.pipe(
                map((s) => s.shapes),
                first()
            )
        })
    };
}
