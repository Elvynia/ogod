import { b2BodyType, b2PolygonShape, b2World } from "@box2d/core";
import { makeFeature$ } from '@ogod/game-engine-driver';
import { distinctUntilKeyChanged, filter, first, ignoreElements, map, merge, switchMap, tap } from "rxjs";
import { makePlayer, makePlayerUpdate$ } from "../player/make";
import { AppState, WorkerSources } from "../state";
import { randNum } from "../util";
import { Shape } from "./state";

export function makeShape<R extends Shape = Shape, T extends Omit<R, 'body'> = Omit<R, 'body'>>(
    shape: T, world: b2World, scale: number): T & Pick<Shape, 'body'> {
    const id = shape.id || randNum(8).toString();
    const b2Width = shape.width / (2 * scale);
    const b2Height = shape.height / (2 * scale);
    const body = world.CreateBody({
        position: {
            x: shape.x / scale,
            y: shape.y / scale
        },
        type: shape.bodyType,
        angle: shape.angle,
        fixedRotation: shape.fixedRotation || false,
        userData: id
    });
    const fix = body.CreateFixture({
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
                        shape.x = Math.round(shape.body.GetPosition().x * state.gmap.scale);
                        shape.y = Math.round(shape.body.GetPosition().y * state.gmap.scale);
                    });
                }),
                ignoreElements()
            )
        })
    )
}

export function makeFeaturePrepareShapes(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'shapes',
        value$: sources.GameEngine.state$.pipe(
            filter((state: any) => !!state.gmap),
            map((state: any) => state.gmap.scale),
            first(),
            map((scale) => ({
                player: makePlayer(sources.World.instance, scale)
            }))
        ),
        target
    });
}

export function makeFeatureUpdateShapes(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'shapes',
        value$: merge(
            makeShapeUpdate$(sources),
            makePlayerUpdate$(sources)
        ),
        target
    });
}
