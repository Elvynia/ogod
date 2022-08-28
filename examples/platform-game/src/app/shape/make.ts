import { b2BodyType, b2PolygonShape, b2World } from "@box2d/core";
import { GameEngineSource } from "@ogod/game-core";
import { distinctUntilKeyChanged, filter, first, ignoreElements, map, merge, of, startWith, switchMap, tap } from "rxjs";
import { Camera } from '../camera/state';
import { makeCreatePlatform } from "../platform/make";
import { makePlayer, makePlayerUpdate$ } from "../player/make";
import { AppState, WorkerSources } from "../state";
import { randNum } from "../util";
import { Shape, Shapes } from "./state";

export function makeShape<R extends Shape = Shape, T extends Omit<R, 'body'> = Omit<R, 'body'>>(
    shape: T, world: b2World, camera: Camera): T & Pick<Shape, 'body'> {
    const id = shape.id || randNum(8).toString();
    const b2Width = shape.width / (2 * camera.scale);
    const b2Height = shape.height / (2 * camera.scale);
    const body = world.CreateBody({
        position: {
            x: shape.x / camera.scale,
            y: shape.y / camera.scale
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

export function makeShapeUpdate$(engine: GameEngineSource<AppState>) {
    return engine.state$.pipe(
        distinctUntilKeyChanged('shapes'),
        switchMap((state) => {
            const shapes = Object.values(state.shapes)
                .filter((s) => s.bodyType === b2BodyType.b2_dynamicBody);
            return engine.update$.pipe(
                tap(() => {
                    shapes.forEach((shape) => {
                        shape.x = Math.round(shape.body.GetPosition().x * state.camera.scale);
                        shape.y = Math.round(shape.body.GetPosition().y * state.camera.scale);
                    });
                }),
                ignoreElements()
            )
        })
    )
}

export function makeShapes$(sources: WorkerSources) {
    return sources.GameEngine.state$.pipe(
        filter((state) => !!state.camera),
        map((state) => state.camera),
        first(),
        switchMap((camera) => {
            const makePlatform = makeCreatePlatform(sources.World.instance, camera);
            const ground0 = makePlatform(400, 5, 'ground0');
            const ground1 = makePlatform(800, 150, 'ground1');
            const ground2 = makePlatform(1200, 300, 'ground2');
            const player = makePlayer(sources.World.instance, camera);
            return merge(
                of({
                    ground0,
                    ground1,
                    ground2,
                    player
                } as Shapes),
                makeShapeUpdate$(sources.GameEngine),
                makePlayerUpdate$(sources)
            )
        }),
        startWith({} as Shapes)
    );
}
