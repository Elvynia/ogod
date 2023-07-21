import { b2BodyType, b2PolygonShape } from "@box2d/core";
import { Box2dSource } from '@ogod/driver-box2d';
import { FeatureKey, makeStateObject } from "@ogod/driver-engine";
import { makeRandNum } from "@ogod/examples-common";
import { first, map } from "rxjs";
import { Camera } from "../camera/state";
import { PlatformStartId } from "../map/platform/generate";
import { AppState, WorkerSources } from "../state";
import { makeFeaturePlayer, makePlayer } from "./player/make";
import { Shape } from "./state";

export function makeShape<S extends Shape>(
    shape: Omit<S, 'body' | 'x' | 'y'>,
    camera: Camera,
    world: Box2dSource
): S {
    const id = shape.id || makeRandNum().toString();
    const b2Width = shape.width / (2 * world.scale);
    const b2Height = shape.height / (2 * world.scale);
    const body = world.instance.CreateBody({
        position: {
            x: shape.worldX / world.scale,
            y: shape.worldY / world.scale
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
        id,
        x: shape.worldX - camera.x,
        y: camera.height - shape.worldY + camera.y
    } as S;
}

export function makeFeatureShapesLoad(sources: WorkerSources): FeatureKey<AppState, 'shapes'> {
    return {
        key: 'shapes',
        publishOnNext: true,
        value$: sources.Engine.state$.pipe(
            first(),
            map(({ camera, map: mapState }) => {
                const startP = mapState.platforms[PlatformStartId];
                return {
                    player: makePlayer(camera, sources.World, 10, startP.worldY + 50)
                }
            })
        )
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
