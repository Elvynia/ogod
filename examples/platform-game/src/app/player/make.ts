import { b2BodyType, b2PolygonShape, b2World } from "@box2d/core";
import { concat, distinctUntilChanged, filter, first, ignoreElements, map, merge, switchMap, takeUntil, tap, timer } from "rxjs";
import { makeShape } from "../shape/make";
import { AppSize, WorkerSources } from "../state";
import { Player, PlayerFeet, PlayerId } from "./state";

export function makePlayer(world: b2World, app: AppSize): Player {
    const width = 16;
    const height = 30;
    const player = makeShape<Player>({
        color: '#A1FFA1',
        id: PlayerId,
        type: 'rect',
        x: 400,
        y: 50,
        width,
        height,
        bodyType: b2BodyType.b2_dynamicBody,
        density: 10,
        grounded: 0,
        jumping: false
    }, world, app);
    const feetShape = new b2PolygonShape().SetAsBox(0.2, 0.2, { x: 0, y: -1.5 });
    player.body.CreateFixture({
        shape: feetShape,
        isSensor: true,
        userData: PlayerFeet
    })
    return player;
}

export function makePlayerUpdate$(sources: WorkerSources) {
    return sources.GameEngine.state$.pipe(
        map((state) => state.shapes.player),
        filter((p) => !!p),
        distinctUntilChanged(),
        switchMap((player: Player) => {
            console.log('Preparing player update...');
            return merge(
                sources.World.contact$.pipe(
                    filter((c) => [c.idA, c.idB].includes(PlayerId) && [c.sensorA, c.sensorB].includes(PlayerFeet)),
                    tap(({ touching }) => { player.grounded += touching }),
                    ignoreElements()
                ),
                sources.GameEngine.update$.pipe(
                    map(() => player.grounded),
                    distinctUntilChanged(),
                    tap((grounded) => {
                        if (grounded > 0) {
                            player.color = '#22D122'
                        } else {
                            player.color = '#A1FFA1';
                        }
                    }),
                    ignoreElements()
                ),
                sources.GameEngine.state$.pipe(
                    tap((state) => console.log('receiving state: ', state.controls.jump, player.jumping, player.grounded > 0)),
                    filter((state) => !player.jumping && state.controls.jump && player.grounded > 0),
                    tap(() => console.log('Starting jump')),
                    switchMap((state) => {
                        player.jumping = true;
                        return concat(
                            sources.GameEngine.update$.pipe(
                                takeUntil(merge(
                                    sources.GameEngine.state$.pipe(
                                        map((state) => state.controls.jump),
                                        filter((jump) => !jump),
                                        first()
                                    ),
                                    timer(400)
                                )),
                                tap({
                                    next: (delta: number) => {
                                        const velocity = player.body.GetLinearVelocity();
                                        player.body.SetLinearVelocity({ x: velocity.x, y: Math.max(velocity.y + delta / 100, 10) })
                                    },
                                    complete: () => {
                                        player.jumping = false;
                                        console.log('Complete jump');
                                    }
                                }),
                                ignoreElements()
                            ),
                            // of(state.shapes)
                        );
                    })
                )
            );
        })
    );
}
