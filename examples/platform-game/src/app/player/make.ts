import { b2BodyType, b2PolygonShape } from "@box2d/core";
import { GameBox2dSource } from '@ogod/game-box2d-driver';
import { concat, distinctUntilChanged, filter, first, ignoreElements, map, merge, of, switchMap, takeUntil, tap, timer } from "rxjs";
import { makeShape } from "../shape/make";
import { AppState, WorkerSources } from "../state";
import { Player, PlayerFeet, PlayerId } from "./state";

export function makePlayer(world: GameBox2dSource): Player {
    const width = 16;
    const height = 30;
    const player = makeShape<Player>({
        color: '#A1FFA1',
        id: PlayerId,
        type: 'rect',
        x: 25,
        y: 525,
        width,
        height,
        bodyType: b2BodyType.b2_dynamicBody,
        density: 50,
        grounded: 0,
        jumping: false,
        fixedRotation: true
    }, world);
    const feetSize = width / (2 * world.scale) - 0.1;
    const feetShape = new b2PolygonShape().SetAsBox(feetSize, feetSize, { x: 0, y: -height / (2 * world.scale) });
    player.body.CreateFixture({
        shape: feetShape,
        isSensor: true,
        userData: PlayerFeet
    })
    return player;
}

export function makePlayerUpdate$(sources: WorkerSources) {
    return sources.GameEngine.state$.pipe(
        filter((state: any) => !!state.shapes.player),
        first(),
        switchMap((state: any) => {
            const player = state.shapes.player;
            return merge(
                sources.World.contact$.pipe(
                    filter((c) => [c.idA, c.idB].includes(PlayerId) && [c.sensorA, c.sensorB].includes(PlayerFeet)),
                    tap(({ touching }) => { player.grounded += touching }),
                    map(() => state.shapes)
                ),
                sources.GameEngine.game$.pipe(
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
                // FIXME: pipe state$ first then switchmap on update$
                sources.GameEngine.game$.pipe(
                    filter(([_, state]) => state.controls.left || state.controls.right || Math.abs(player.body.GetLinearVelocity().x) > 0),
                    tap(([{ delta }, state]) => {
                        const velocity = player.body.GetLinearVelocity();
                        if (state.controls.left || state.controls.right) {
                            const dir = state.controls.left ? -1 : 1;
                            if (Math.abs(velocity.x) < 8) {
                                player.body.SetLinearVelocity({ x: velocity.x + dir * delta / 30, y: velocity.y });
                            }
                        } else {
                            player.body.SetLinearVelocity({ x: 0, y: velocity.y });
                        }
                    }),
                    ignoreElements()
                ),
                sources.GameEngine.state$.pipe(
                    filter((state: any) => !player.jumping && state.controls.jump && player.grounded > 0),
                    switchMap((state: AppState) => {
                        player.jumping = true;
                        return concat(
                            sources.GameEngine.game$.pipe(
                                takeUntil(merge(
                                    sources.GameEngine.state$.pipe(
                                        map((state: any) => state.controls.jump),
                                        filter((jump) => !jump),
                                        first()
                                    ),
                                    timer(400)
                                )),
                                tap({
                                    next: ([{ delta }]) => {
                                        const velocity = player.body.GetLinearVelocity();
                                        player.body.SetLinearVelocity({ x: velocity.x, y: Math.min(velocity.y + delta / 20, 15) })
                                    },
                                    complete: () => player.jumping = false
                                }),
                                ignoreElements()
                            ),
                            of(state.shapes)
                        );
                    })
                )
            );
        })
    );
}
