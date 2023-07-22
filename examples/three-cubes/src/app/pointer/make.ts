import { FeatureKey } from "@ogod/driver-engine";
import { map } from "rxjs";
import { Vector2 } from "three";
import { AppState, WorkerSources } from "../state";

export function makeFeaturePointer(sources: WorkerSources): FeatureKey<AppState, 'pointer'> {
    const value = new Vector2();
    return {
        key: 'pointer',
        publishOnCreate: true,
        value$: sources.Engine.action$.getHandler('pointer').pipe(
            map(({ x, y }) => {
                value.x = x;
                value.y = y;
                return value;
            })
        ),
        value
    }
}
