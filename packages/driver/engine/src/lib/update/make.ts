import { UpdateState } from "@ogod/core";
import { Observable, animationFrames, map, pairwise } from "rxjs";

export function makeUpdate$(): Observable<UpdateState> {
    return animationFrames().pipe(
        pairwise(),
        map(([prev, cur]) => ({
            ...cur,
            delta: cur.elapsed - prev.elapsed
        })),
    );
}
