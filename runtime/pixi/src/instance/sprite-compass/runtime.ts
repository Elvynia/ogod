import { PixiRuntimeSpriteAnimated } from "../sprite-animated/runtime";
import { Observable } from "rxjs";
import { PixiStateSpriteCompass } from "./state";
import { OgodStateEngine, OgodActionInstance } from "@ogod/common";
import { ActionsObservable } from "redux-observable";

export class PixiRuntimeSpriteCompass extends PixiRuntimeSpriteAnimated {

    initialize(state: PixiStateSpriteCompass, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.animation = state.animationBase + '/' + state.compass;
        return super.initialize(state, state$, action$);
    }

    initializeProperties(state: PixiStateSpriteCompass) {
        super.initializeProperties(state);
        this.checkAnimation(0, state);
    }

    updateStateCompass(_, state: PixiStateSpriteCompass) {
        this.checkAnimation(_, state);
    }

    updateStateAnimationBase(_, state: PixiStateSpriteCompass) {
        this.checkAnimation(_, state);
    }

    checkAnimation(delta: number, state: PixiStateSpriteCompass) {
        const animation = state.animationBase + '/' + state.compass;
        if (animation !== state.animationBase) {
            state.animation = animation;
            this.updateStateAnimation(delta, state);
        }
    }
}
