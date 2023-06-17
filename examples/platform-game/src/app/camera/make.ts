import { FeatureKey } from "@ogod/driver-engine";
import { map, skip } from "rxjs";
import { AppState, WorkerSources } from "../state";
import { Camera } from "./state";

export function makeFeatureCamera(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    const value = {
        x: 0,
        y: 0
    } as Camera;
    return {
        key: 'camera',
        publishOnCreate: true,
        publishOnNext: true,
        value$: sources.Engine.target$.pipe(
            skip(1),
            map((canvas) => {
                value.width = canvas.width;
                value.height = canvas.height;
                return value;
            })
        ),
        value
    };
}
