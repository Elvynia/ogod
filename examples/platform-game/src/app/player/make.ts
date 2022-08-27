import { b2BodyType, b2PolygonShape, b2World } from "@box2d/core";
import { concat, distinctUntilChanged, filter, first, ignoreElements, map, merge, of, switchMap, takeUntil, tap, timer, withLatestFrom } from "rxjs";
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
        density: 50,
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
        filter((state) => !!state.shapes.player),
        first(),
        switchMap((state) => {
            const player = state.shapes.player;
            return merge(
                sources.World.contact$.pipe(
                    filter((c) => [c.idA, c.idB].includes(PlayerId) && [c.sensorA, c.sensorB].includes(PlayerFeet)),
                    tap(({ touching }) => { player.grounded += touching }),
                    map(() => state.shapes)
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
                // FIXME: pipe state$ first then switchmap on update$
                sources.GameEngine.update$.pipe(
                    withLatestFrom(sources.GameEngine.state$),
                    filter(([_, state]) => state.controls.left || state.controls.right || Math.abs(player.body.GetLinearVelocity().x) > 0),
                    tap(([delta, state]) => {
                        const velocity = player.body.GetLinearVelocity();
                        if (state.controls.left || state.controls.right) {
                            const dir = state.controls.left ? -1 : 1;
                            if (Math.abs(velocity.x) < 10) {
                                player.body.SetLinearVelocity({ x: velocity.x + dir * delta * 10, y: velocity.y });
                            }
                        } else {
                            player.body.SetLinearVelocity({ x: 0, y: velocity.y });
                        }
                    }),
                    ignoreElements()
                ),
                sources.GameEngine.state$.pipe(
                    filter((state) => !player.jumping && state.controls.jump && player.grounded > 0),
                    // tap(() => console.log('Starting jump')),
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
                                        player.body.SetLinearVelocity({ x: velocity.x, y: Math.min(velocity.y + delta * 100, 10) })
                                    },
                                    complete: () => {
                                        player.jumping = false;
                                        // console.log('Complete jump');
                                    }
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
