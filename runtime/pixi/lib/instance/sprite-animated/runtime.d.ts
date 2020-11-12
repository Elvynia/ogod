import { PixiStateSpriteAnimated } from "./state";
import { Observable } from "rxjs";
import { OgodStateEngine } from "@ogod/common";
import { PixiRuntimeSprite } from "../sprite/runtime";
export declare class PixiRuntimeSpriteAnimated extends PixiRuntimeSprite {
    initializeSprite(state: PixiStateSpriteAnimated, state$: Observable<OgodStateEngine>): Observable<PixiStateSpriteAnimated>;
    initializeProperties(state: PixiStateSpriteAnimated): void;
    update(delta: number, state: PixiStateSpriteAnimated): void;
    updateStateLoop(_: any, state: PixiStateSpriteAnimated): void;
    updateStateAnimation(_: any, state: PixiStateSpriteAnimated): void;
    updateStatePlaying(_: any, state: PixiStateSpriteAnimated): void;
    protected getAnimation(state: PixiStateSpriteAnimated): PIXI.Texture[];
}
