import { EngineFn } from "@ogod/driver-engine";
import { makeDrawCircle, makeDrawRect } from "@ogod/examples-common";
import { Observable, first, map, switchMap } from "rxjs";
import { WorkerSources } from "./state";

export function makeRender(sources: WorkerSources): Observable<EngineFn[]> {
    return sources.Engine.state$.pipe(
        first(),
        switchMap((state) => sources.Engine.target$.pipe(
            map((canvas) => {
                const ctx = canvas.getContext('2d');
                const drawHandlers: any = {
                    circle: makeDrawCircle(ctx),
                    rect: makeDrawRect(ctx)
                };
                return [() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    Object.values(state.objects).forEach((obj) => drawHandlers[obj.type](obj));
                }];
            })
        ))
    );
}
