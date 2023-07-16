import { b2BodyType, b2PolygonShape } from "@box2d/core";
import { Box2dSource } from '@ogod/driver-box2d';
import { FeatureKey, makeStateObject } from "@ogod/driver-engine";
import { filter, first, map, merge, of, switchMap, takeUntil, tap, timer } from "rxjs";
import { Camera } from "../../camera/state";
import { AppState, WorkerSources } from "../../state";
import { makeShape } from "../make";
import { Shapes } from "../state";
import { Player, PlayerFeet, PlayerId } from "./state";

export const makePlayerPosition = (scale: number = 1) => ({
    x: scale * 1,
    y: scale * 25
});

export function makePlayer(camera: Camera, world: Box2dSource): Player {
    const width = 16;
    const height = 30;
    const pos = makePlayerPosition(world.scale);
    const player = makeShape<Player>({
        angle: 0,
        color: '#A1FFA1',
        id: PlayerId,
        width,
        height,
        bodyType: b2BodyType.b2_dynamicBody,
        density: 50,
        grounded: 0,
        jumping: false,
        fixedRotation: true,
        type: 'rect',
        opacity: 1,
        worldX: pos.x,
        worldY: pos.y
    }, camera, world);
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
        value$: sources.Engine.state$.getState('player.grounded').pipe(
            map((grounded) => grounded > 0 ? '#22D122' : '#A1FFA1')
        )
    }
}

function makeFeaturePlayerGrounded(sources: WorkerSources, player: Player): FeatureKey<Player, 'grounded'> {
    return {
        key: 'grounded',
        value$: sources.Engine.state$.registerState('player.grounded', sources.World.contact$.pipe(
            filter((c) => [c.dataA, c.dataB].includes(PlayerId) && [c.sensorA, c.sensorB].includes(PlayerFeet)),
            map(({ touching }) => player.grounded + touching)
        ))
    }
}

function makeGamePlayerMovement(sources: WorkerSources, state: AppState) {
    const player = state.shapes.player;
    return sources.Engine.engine$.pipe(
        filter(() => state.controls.left || state.controls.right || Math.abs(player.body.GetLinearVelocity().x) > 0)
    ).subscribe(({ delta }) => {
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
    return sources.Engine.state$.pipe(
        filter((state: any) => !player.jumping && state.controls.jump && player.grounded > 0),
        switchMap(() => {
            player.jumping = true;
            return sources.Engine.engine$.pipe(
                takeUntil(merge(
                    sources.Engine.state$.pipe(
                        map((state: any) => state.controls.jump),
                        filter((jump) => !jump),
                        first()
                    ),
                    timer(400)
                )),
                tap({
                    next: ({ delta }) => {
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
    return sources.Engine.state$.pipe(
        first(),
        map((state) => {
            const subMove = makeGamePlayerMovement(sources, state);
            const subJump = makeGamePlayerJump(sources, state.shapes.player);
            return {
                key: 'player',
                value$: makeStateObject({
                    key$: of(
                        makeFeaturePlayerGrounded(sources, state.shapes.player),
                        makeFeaturePlayerColor(sources)
                    ),
                    state: state.shapes.player
                }),
                subscriptions: [subMove, subJump]
            } as FeatureKey<Shapes, 'player'>
        }))
}
