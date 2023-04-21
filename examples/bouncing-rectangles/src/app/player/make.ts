import { makeFeature$ } from "@ogod/game-engine-driver";
import { ignoreElements, map, merge, startWith, tap } from 'rxjs';
import { updateMovement } from "../object/make";
import { makeRect } from '../rect';
import { AppState, WorkerSources } from "../state";

export function makeFeaturePlayer(sources: WorkerSources, target: AppState) {
    const player = makeRect({
        x: 400,
        y: 400,
        width: 15,
        height: 25,
        dynamic: true
    }, sources.World.instance, target.camera.scale);
    return makeFeature$({
        key: 'player',
        value$: merge(
            sources.GameEngine.actionHandlers.playerColor.pipe(
                map((color: string) => {
                    player.color = color;
                    return player;
                })
            ),
            sources.GameEngine.game$.pipe(
                tap(([delta]) => updateMovement(delta, player, target.camera)),
                ignoreElements()
            )
        ),
        target
    })
}
