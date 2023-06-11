import { FeatureKey } from "@ogod/driver-engine";
import { map } from "rxjs";
import { AppState, WorkerSources } from "../state";

export function makeFeatureOffset(sources: WorkerSources): FeatureKey<AppState, 'offset'> {
    return {
        key: 'offset',
        publishOnNext: true,
        value$: sources.Engine.action$.getHandler('offset').pipe(
            map((offset) => {
                let incr = 0;
                return offset !== 0 ? () => incr += offset : () => 0;
            })
        )
    };
}
