import { b2BodyType, b2PolygonShape, b2World } from "@box2d/core";
import { GameEngineSource } from "@ogod/game-core";
import { distinctUntilKeyChanged, first, ignoreElements, merge, of, switchMap, tap } from "rxjs";
import { makeCreatePlatform } from "../platform/make";
import { makePlayer, makePlayerUpdate$ } from "../player/make";
import { AppSize, AppState, WorkerSources } from "../state";
import { randNum } from "../util";
import { Shape, Shapes } from "./state";

export function makeShape<R extends Shape = Shape, T extends Omit<R, 'body'> = Omit<R, 'body'>>(
    shape: T, world: b2World, app: AppSize): T & Pick<Shape, 'body'> {
    const id = shape.id || randNum(8).toString();
    const b2Width = shape.width / (2 * app.scale);
    const b2Height = shape.height / (2 * app.scale);
    const body = world.CreateBody({
        position: {
            x: shape.x / app.scale,
            y: shape.y / app.scale
        },
        type: shape.bodyType,
        angle: shape.angle,
        userData: id
    });
    body.CreateFixture({
        shape: new b2PolygonShape().SetAsBox(b2Width, b2Height),
        density: shape.density || shape.bodyType === b2BodyType.b2_dynamicBody ? 1 : undefined,
        restitution: 0
    });
    return {
        ...shape,
        body,
        id
    };
}

export function makeShapeUpdate$(engine: GameEngineSource<AppState>) {
    return engine.state$.pipe(
        distinctUntilKeyChanged('shapes'),
        switchMap((state) => {
            const shapes = Object.values(state.shapes)
                .filter((s) => s.bodyType === b2BodyType.b2_dynamicBody);
            return engine.update$.pipe(
                tap(() => {
                    shapes.forEach((shape) => {
                        shape.x = Math.round(shape.body.GetPosition().x * state.app.scale);
                        shape.y = Math.round(shape.body.GetPosition().y * state.app.scale);
                    });
                }),
                ignoreElements()
            )
        })
    )
}

export function makeShapes$(sources: WorkerSources) {
    return sources.GameEngine.action$.app.pipe(
        first(),
        switchMap((app) => {
            const makePlatform = makeCreatePlatform(sources.World.instance, app);
            const ground0 = makePlatform(400, 0);
            const player = makePlayer(sources.World.instance, app);
            return merge(
                of({
                    [ground0.id]: ground0,
                    player
                } as Shapes),
                makeShapeUpdate$(sources.GameEngine),
                makePlayerUpdate$(sources)
            )
        })
    );
}
