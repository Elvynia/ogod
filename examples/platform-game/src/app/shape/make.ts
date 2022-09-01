import { b2BodyType, b2PolygonShape, b2World } from "@box2d/core";
import { GameEngineSource } from "@ogod/game-core";
import { distinctUntilKeyChanged, filter, first, ignoreElements, map, merge, of, startWith, switchMap, tap } from "rxjs";
import { makePlayer, makePlayerUpdate$ } from "../player/make";
import { WorkerSources } from "../state";
import { randNum } from "../util";
import { Shape, Shapes } from "./state";

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

export function makeShapeUpdate$(engine: GameEngineSource) {
    return engine.state$.pipe(
        distinctUntilKeyChanged('shapes'),
        switchMap((state) => {
            const shapes = Object.values(state.shapes)
                .filter((s: any) => s.bodyType === b2BodyType.b2_dynamicBody);
            return engine.update$.pipe(
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

export function makeShapes$(sources: WorkerSources) {
    return sources.GameEngine.state$.pipe(
        filter((state: any) => !!state.gmap),
        map((state: any) => state.gmap.scale),
        first(),
        switchMap((scale) => {
            const player = makePlayer(sources.World.instance, scale);
            return merge(
                of({
                    player
                } as Shapes),
                makeShapeUpdate$(sources.GameEngine),
                makePlayerUpdate$(sources)
            )
        }),
        startWith({} as Shapes)
    );
}
