import { OgodActionInstance, OgodStateEngine } from "@ogod/common";
import { ogodRuntimeKeys } from "@ogod/runtime-core";
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter, map, switchMap, first, tap } from 'rxjs/operators';
import { Quaternion, Vector3 } from "three";
import { ThreeStateScene } from '../../scene/default/state';
import { ThreeRuntimeInstance } from './../default/runtime';
import { ThreeStateControlFly } from "./state";

const EPS = 0.000001;

export class ThreeRuntimeControlFly extends ThreeRuntimeInstance {

    initialize(state: ThreeStateControlFly, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.translator = state.translator || new Vector3();
        state.rotator = state.rotator || new Vector3();
        return state$.pipe(
            filter((fs) => state.scenes.length > 0 && fs.scene[state.scenes[0]].loaded),
            first(),
            map((fs) => fs.scene[state.scenes[0]] as ThreeStateScene),
            map((scene) => ({
                ...state,
                object$: scene.camera$,
                tmpQuaternion: new Quaternion()
            })),
            tap((initState) => this.updateStateKeys(0, initState)),
            switchMap((initState) => super.initialize(initState, state$, action$))
        );
    }


    changes(changes: Partial<ThreeStateControlFly>, state: ThreeStateControlFly): Observable<OgodActionInstance> {
        if (changes.keys) {
            Object.assign(state, { keys: changes.keys });
            this.updateStateKeys(0, state);
        }
        return super.changes(changes, state);
    }

    update(delta: number, state: ThreeStateControlFly) {
        const lastQuaternion = new Quaternion();
        const lastPosition = new Vector3();
        super.update(delta, state);
        let speed = state.movementSpeed;
        if (state.keys$?.shift) {
            speed = state.movementSpeed * state.speedMultiplier;
        }
        var moveMult = delta * speed / 1000;
        var rotMult = delta * state.rollSpeed / 1000;

        state.object$.translateX(state.translator.x * moveMult);
        state.object$.translateY(state.translator.y * moveMult);
        state.object$.translateZ(state.translator.z * moveMult);

        state.tmpQuaternion.set(state.rotator.x * rotMult, state.rotator.y * rotMult, state.rotator.z * rotMult, 1).normalize();
        state.object$.quaternion.multiply(state.tmpQuaternion);

        if (lastPosition.distanceToSquared(state.object$.position) > EPS
            || 8 * (1 - lastQuaternion.dot(state.object$.quaternion)) > EPS) {
            lastQuaternion.copy(state.object$.quaternion);
            lastPosition.copy(state.object$.position);
        }
    }

    updateStateKeys(delta: number, state: ThreeStateControlFly) {
        ogodRuntimeKeys(state);
        if (state.keys$) {
            var forward = (state.keys$.forward || (state.keys$.autoForward && !state.keys$.back)) ? 1 : 0;
            state.translator.x = (- state.keys$.left + state.keys$.right);
            state.translator.y = (- state.keys$.down + state.keys$.up);
            state.translator.z = (- forward + state.keys$.back);
            state.rotator.x = (- state.keys$.pitchDown + state.keys$.pitchUp);
            state.rotator.y = (- state.keys$.yawRight + state.keys$.yawLeft);
            state.rotator.z = (- state.keys$.rollRight + state.keys$.rollLeft);
        }
    }
}
