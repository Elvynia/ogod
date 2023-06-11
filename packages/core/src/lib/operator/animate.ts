import { OperatorFunction, map, takeWhile } from "rxjs";
import { UpdateState } from "../update";

export type EaseFn = (d: number) => number;

export function animate(duration: number): OperatorFunction<UpdateState, number> {
    let time = 0;
    return (source) => source.pipe(
        map(({ delta }) => {
            time += delta;
            if (time < duration) {
                return time / duration;
            }
            return 1;
        }),
        takeWhile((d) => d < 1, true)
    )
}
