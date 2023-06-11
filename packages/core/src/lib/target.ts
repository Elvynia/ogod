import { Observable, concat, debounceTime, fromEvent, map, of, startWith } from "rxjs";
import { makeMessageEngine } from "./message/make";
import { WorkerMessageEngine } from "./message/state";

export function makeTargetActions(params: {
    canvas: HTMLCanvasElement,
    resizeDebounceTime: number
}): Observable<WorkerMessageEngine> {
    const offscreen = params.canvas.transferControlToOffscreen();
    return concat(
        of(makeMessageEngine('OGOD_ENGINE_TARGET', offscreen, [offscreen])),
        fromEvent(window, 'resize').pipe(
            debounceTime(params.resizeDebounceTime),
            startWith(null),
            map(() => makeMessageEngine('OGOD_ENGINE_RESIZE', {
                width: params.canvas.clientWidth,
                height: params.canvas.clientHeight
            }))
        )
    )
}
