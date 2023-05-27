import { XY, b2BodyType, b2PolygonShape } from "@box2d/core";
import { GameBox2dSource } from '@ogod/game-box2d-driver';
import { FeatureKey, makeStateObject } from "@ogod/game-engine-driver";
import { filter, finalize, first, map, merge, of, switchMap, takeUntil, tap, timer } from "rxjs";
import { WorkerSources } from "../../state";
import { WORLD_SCALE } from "../../util";
import { makeShape } from "../make";
import { Player, PlayerFeet, PlayerId } from "./state";

export const PLAYER_INIT_POS_BODY: XY = {
    x: 1,
    y: 25
};
export const PLAYER_INIT_POS: XY = {
    x: PLAYER_INIT_POS_BODY.x * WORLD_SCALE,
    y: PLAYER_INIT_POS_BODY.y * WORLD_SCALE
};

export function makePlayer(world: GameBox2dSource): Player {
    const width = 16;
    const height = 30;
    const player = makeShape<Player>({
        ...PLAYER_INIT_POS,
        color: '#A1FFA1',
        id: PlayerId,
        type: 'rect',
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

function makeFeaturePlayerColor(sources: WorkerSources): FeatureKey<Player, 'color'> {
    return {
        key: 'color',
        value$: sources.GameEngine.state$.getState('player.grounded').pipe(
            map((grounded) => grounded > 0 ? '#22D122' : '#A1FFA1')
        )
    }
}

function makeFeaturePlayerGrounded(sources: WorkerSources, player: Player): FeatureKey<Player, 'grounded'> {
    return {
        key: 'grounded',
        value$: sources.GameEngine.state$.registerState('player.grounded', sources.World.contact$.pipe(
            filter((c) => [c.dataA, c.dataB].includes(PlayerId) && [c.sensorA, c.sensorB].includes(PlayerFeet)),
            map(({ touching }) => player.grounded + touching)
        ))
    }
}

function makeGamePlayerMovement(sources: WorkerSources, player: Player) {
    return sources.GameEngine.game$.pipe(
        filter(([_, state]) => state.controls.left || state.controls.right || Math.abs(player.body.GetLinearVelocity().x) > 0)
    ).subscribe(([{ delta }, state]) => {
        const velocity = player.body.GetLinearVelocity();
        if (state.controls.left || state.controls.right) {
            const dir = state.controls.left ? -1 : 1;
            if (Math.abs(velocity.x) < 8) {
                player.body.SetLinearVelocity({ x: velocity.x + dir * delta / 30, y: velocity.y });
            }
        } else {
            player.body.SetLinearVelocity({ x: 0, y: velocity.y });
        }
    });
}

function makeGamePlayerJump(sources: WorkerSources, player: Player) {
    return sources.GameEngine.state$.pipe(
        filter((state: any) => !player.jumping && state.controls.jump && player.grounded > 0),
        switchMap(() => {
            player.jumping = true;
            return sources.GameEngine.game$.pipe(
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
                })
            );
        })
    ).subscribe();
}

export function makeFeaturePlayer(sources: WorkerSources) {
    return sources.GameEngine.state$.pipe(
        map((s) => s.shapes.player),
        first(),
        map((player) => {
            const subMove = makeGamePlayerMovement(sources, player);
            const jumpMove = makeGamePlayerJump(sources, player);
            return {
                key: 'player',
                value$: makeStateObject({
                    key$: of(
                        makeFeaturePlayerGrounded(sources, player),
                        makeFeaturePlayerColor(sources)
                    ),
                    state: player
                }).pipe(
                    finalize(() => {
                        subMove.unsubscribe();
                        jumpMove.unsubscribe();
                    })
                )
            }
        }))
}
