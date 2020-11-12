import { PixiStateSpriteTiled } from "./state";
import { Observable } from "rxjs";
import { OgodStateEngine } from "@ogod/common";
import { PixiRuntimeSprite } from "../sprite/runtime";
export declare class PixiRuntimeSpriteTiled extends PixiRuntimeSprite {
    initializeSprite(state: PixiStateSpriteTiled, state$: Observable<OgodStateEngine>): Observable<PixiStateSpriteTiled>;
    update(delta: number, state: PixiStateSpriteTiled): void;
}
