import { makeFeatureObservable } from "@ogod/game-engine-driver";
import { Observable, tap } from "rxjs";
import { Screen } from "./state";

export function makeScreen(width: number, height: number, scale: number = 10) {
    return {
        width,
        height,
        scale
    } as Screen;
}

export function makeFeatureScreen(screen$: Observable<Screen>, canvas: any, initValue?: Screen) {
    return makeFeatureObservable('screen', screen$.pipe(
        tap((screen) => {
            canvas.width = screen.width;
            canvas.height = screen.height;
        })
    ), initValue);
}
