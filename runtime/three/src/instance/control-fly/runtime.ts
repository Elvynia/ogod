import { OgodActionInstance, OgodStateEngine } from "@ogod/common";
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter, map, switchMap, first, tap } from 'rxjs/operators';
import { Quaternion, Vector3 } from "three";
import { ThreeStateScene } from '../../scene/default/state';
import { ThreeRuntimeInstance } from './../default/runtime';
import { ThreeStateControlFly } from "./state";

const EPS = 0.000001;

export class ThreeRuntimeControlFly extends ThreeRuntimeInstance {
    lastQuaternion = new Quaternion();
    lastPosition = new Vector3();

    initialize(state: ThreeStateControlFly, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
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
            this.updateStateKeys(0, { ...state, ...changes });
        }
        return super.changes(changes, state);
    }

    update(delta: number, state: ThreeStateControlFly) {
        super.update(delta, state);
        let speed = state.movementSpeed;
        if (state.keys.shift) {
            speed = state.movementSpeed * state.speedMultiplier;
        }
        var moveMult = delta * speed / 1000;
        var rotMult = delta * state.rollSpeed / 1000;

        state.object$.translateX(state.translate.x * moveMult);
        state.object$.translateY(state.translate.y * moveMult);
        state.object$.translateZ(state.translate.z * moveMult);

        state.tmpQuaternion.set(state.rotate.x * rotMult, state.rotate.y * rotMult, state.rotate.z * rotMult, 1).normalize();
        state.object$.quaternion.multiply(state.tmpQuaternion);

        if (
            this.lastPosition.distanceToSquared(state.object$.position) > EPS ||
            8 * (1 - this.lastQuaternion.dot(state.object$.quaternion)) > EPS
        ) {
            this.lastQuaternion.copy(state.object$.quaternion);
            this.lastPosition.copy(state.object$.position);

        }
    }

    updateStateKeys(delta: number, state: ThreeStateControlFly) {
        var forward = (state.keys.forward || (state.autoForward && !state.keys.back)) ? 1 : 0;

        state.translate.x = (- state.keys.left + state.keys.right);
        state.translate.y = (- state.keys.down + state.keys.up);
        state.translate.z = (- forward + state.keys.back);
        state.rotate.x = (- state.keys.pitchDown + state.keys.pitchUp);
        state.rotate.y = (- state.keys.yawRight + state.keys.yawLeft);
        state.rotate.z = (- state.keys.rollRight + state.keys.rollLeft);
    }
}
