import { makeFeature$ } from "@ogod/game-engine-driver";
import { map } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureOffset(sources: WorkerSources, target: AppState) {
    return makeFeature$({
        key: 'offset',
        value$: sources.GameEngine.actionHandler.offset.pipe(
            map((offset) => {
                let incr = 0;
                return offset !== 0 ? () => incr += offset : () => 0;
            })
        ),
        target
    })
}
