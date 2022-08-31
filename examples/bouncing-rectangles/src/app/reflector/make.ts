import { ReflectFunction } from "@ogod/game-core";
import { filter, first, map, Observable } from "rxjs";
import { WorkerSources } from "../state";

export function makeReflector$(sources: WorkerSources): Observable<ReflectFunction> {
    return sources.GameEngine.state$.pipe(
        filter((state) => state.screen && state.player && state.objects),
        first(),
        map(() => (state) => {
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
        })
    )
}
