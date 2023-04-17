import { Observable, animationFrames, map, pairwise } from "rxjs";
import { UpdateState, isUpdateState } from "./state";

export function makeUpdate$(): Observable<UpdateState>;
export function makeUpdate$(update: UpdateState): Observable<UpdateState>;
export function makeUpdate$(update: number): Observable<number>;
export function makeUpdate$<U = UpdateState | number>(update?: U) {
    if (update === undefined) {
        return animationFrames().pipe(
            pairwise(),
            map(([prev, cur]) => ({
                ...cur,
                delta: cur.elapsed - prev.elapsed
            })),
        );
    } else {
        if (isUpdateState(update)) {
            return animationFrames().pipe(
                pairwise(),
                map(([prev, cur]) => {
                    update.timestamp = cur.timestamp;
                    update.elapsed = cur.elapsed;
                    update.delta = cur.elapsed - prev.elapsed;
                    return update;
                }),
            );
        } else {
            return animationFrames().pipe(
                pairwise(),
                map(([prev, cur]) => cur.elapsed - prev.elapsed)
            );
        }
    }
}
