import { PixiStateSpriteTiled } from "./state";
import { Observable } from "rxjs";
import { OgodStateEngine } from "@ogod/common";
import { PixiStateTexture } from "../../resource/texture/state";
import { map } from "rxjs/operators";
import { waitForResource } from "../default/runtime";
import { PixiRuntimeSprite } from "../sprite/runtime";
import { TilingSprite } from "pixi.js";

export class PixiRuntimeSpriteTiled extends PixiRuntimeSprite {

    initializeSprite(state: PixiStateSpriteTiled, state$: Observable<OgodStateEngine>): Observable<PixiStateSpriteTiled> {
        return waitForResource<PixiStateTexture>(state, state$).pipe(
            map((data) => ({
                ...state,
                resource$: data,
                instance$: new TilingSprite(data, state.width, state.height)
            }))
        );
    }

    update(delta: number, state: PixiStateSpriteTiled) {
        if (state.speed && state.speed !== 0) {
            state.instance$.tilePosition.x += (state.speed * state.ratio) * delta / 1000;
        }
    }
}
