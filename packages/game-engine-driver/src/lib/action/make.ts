import { FeatureState } from "@ogod/game-engine-driver";
import { Subject } from "rxjs";
import { ActionState } from "./state";

export function makeAction$<S extends FeatureState>(gameState: S) {
    const actionState = Object.keys(gameState)
        .map((k) => ({ [k]: new Subject<any>() }))
        .reduce((actionState, action$) => Object.assign(actionState, action$), {}) as ActionState<S>;
    actionState.select = (key: string) => actionState[key];
    return actionState;
}
