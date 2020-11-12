import { PixiRuntimeSpriteAnimated } from "../sprite-animated/runtime";
import { Observable } from "rxjs";
import { PixiStateSpriteCompass } from "./state";
import { OgodStateEngine, OgodActionInstance } from "@ogod/common";
export declare class PixiRuntimeSpriteCompass extends PixiRuntimeSpriteAnimated {
    initialize(state: PixiStateSpriteCompass, state$: Observable<OgodStateEngine>): Observable<OgodActionInstance>;
    initializeProperties(state: PixiStateSpriteCompass): void;
    updateStateCompass(_: any, state: PixiStateSpriteCompass): void;
    updateStateAnimationBase(_: any, state: PixiStateSpriteCompass): void;
    checkAnimation(delta: number, state: PixiStateSpriteCompass): void;
}
