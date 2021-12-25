import { waitForResource, PixiRuntimeInstance } from "../default/runtime";
import { PixiStateTexture } from "../../resource/texture/state";
import { OgodStateEngine } from "@ogod/common";
import { Observable } from "rxjs";
import { PixiStateSprite } from "./state";
import { map } from "rxjs/operators";
import { Sprite } from "pixi.js";

export class PixiRuntimeSprite extends PixiRuntimeInstance {

    initializeSprite(state: PixiStateSprite, state$: Observable<OgodStateEngine>): Observable<PixiStateSprite> {
        return waitForResource<PixiStateTexture>(state, state$).pipe(
            map((data) => ({
                ...state,
                resource$: data,
                instance$: new Sprite(data)
            }))
        );
    }

    initializeProperties(state: PixiStateSprite) {
        super.initializeProperties(state);
        if (state.anchor != null) {
            this.updateStateAnchor(0, state);
        } else {
            this.updateStateAnchorX(0, state);
            this.updateStateAnchorY(0, state);
        }
    }

    updateStateAnchor(_, state: PixiStateSprite) {
        state.anchorX = state.anchor;
        state.anchorY = state.anchor;
        this.updateStateAnchorX(_, state);
        this.updateStateAnchorY(_, state);
    }

    updateStateAnchorX(_, state: PixiStateSprite) {
        state.instance$.anchor.x = state.anchorX;
    }

    updateStateAnchorY(_, state: PixiStateSprite) {
        state.instance$.anchor.y = state.anchorY;
    }
}
