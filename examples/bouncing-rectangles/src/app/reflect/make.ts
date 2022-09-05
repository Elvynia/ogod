import { ReflectState } from "@ogod/game-core";
import { makeRuntime } from "@ogod/game-engine-driver";
import { filter, first, map, Observable } from "rxjs";
import { WorkerSources } from "../state";

export function makeReflect$(sources: WorkerSources): Observable<ReflectState> {
    return sources.GameEngine.state$.pipe(
        filter((state) => state.screen && state.player && !!state.objects),
        first(),
        map(() => makeRuntime((state) => {
            const values = Object.values(state.objects || {});
            return {
                fps: state.fps,
                objectCount: values.length,
                objects: values.map(({ id, x, y, width, height, health, body }) => ({
                    id,
                    x,
                    y,
                    width,
                    height,
                    health,
                    angle: -body.GetAngle()
                }))
            };
        }))
    )
}
