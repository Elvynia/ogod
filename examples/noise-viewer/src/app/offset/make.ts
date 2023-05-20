import { FeatureKey } from "@ogod/game-engine-driver";
import { map } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureOffset(sources: WorkerSources): FeatureKey<AppState, 'offset'> {
    return {
        key: 'offset',
        publishOnNext: true,
        value$: sources.GameEngine.action$.getHandler('offset').pipe(
            map((offset) => {
                let incr = 0;
                return offset !== 0 ? () => incr += offset : () => 0;
            })
        )
    };
}
