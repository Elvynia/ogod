import { makeFeatureObservable } from "@ogod/game-engine-driver";
import { ignoreElements, map, merge, tap } from 'rxjs';
import { updateMovement } from "../object/make";
import { makeRect } from '../rect';
import { Screen } from "../screen/state";
import { WorkerSources } from "../state";

export function makeFeaturePlayer(sources: WorkerSources, screen: Screen) {
    const player = makeRect({
        x: 400,
        y: 400,
        width: 15,
        height: 25,
        dynamic: true
    }, sources.World.instance, screen.scale);
    return makeFeatureObservable('player', merge(
        sources.GameEngine.actions.playerColor.pipe(
            map((color: string) => {
                player.color = color;
                return player;
            })
        ),
        sources.GameEngine.update$.pipe(
            tap((delta) => updateMovement(delta, player, screen)),
            ignoreElements()
        )
    ), player)
}
