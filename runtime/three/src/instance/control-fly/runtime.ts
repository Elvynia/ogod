import { OgodActionInstance, OgodStateEngine } from "@ogod/common";
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter, map, switchMap, first, tap } from 'rxjs/operators';
import { Quaternion, Vector3 } from "three";
import { ThreeStateScene } from '../../scene/default/state';
import { ThreeRuntimeInstance } from './../default/runtime';
import { ThreeStateControlFly } from "./state";

const EPS = 0.000001;
const changeEvent = { type: 'change' };

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

        state.object$.translateX(state.translation.x * moveMult);
        state.object$.translateY(state.translation.y * moveMult);
        state.object$.translateZ(state.translation.z * moveMult);

        state.tmpQuaternion.set(state.rotation.x * rotMult, state.rotation.y * rotMult, state.rotation.z * rotMult, 1).normalize();
        state.object$.quaternion.multiply(state.tmpQuaternion);

        if (
            this.lastPosition.distanceToSquared(state.object$.position) > EPS ||
            8 * (1 - this.lastQuaternion.dot(state.object$.quaternion)) > EPS
        ) {
            // state.dispatchEvent(changeEvent);
            this.lastQuaternion.copy(state.object$.quaternion);
            this.lastPosition.copy(state.object$.position);

        }
    }

    updateStateKeys(delta: number, state: ThreeStateControlFly) {
		var forward = ( state.keys.forward || ( state.autoForward && ! state.keys.back ) ) ? 1 : 0;

		state.translation.x = ( - state.keys.left + state.keys.right );
		state.translation.y = ( - state.keys.down + state.keys.up );
		state.translation.z = ( - forward + state.keys.back );
		state.rotation.x = ( - state.keys.pitchDown + state.keys.pitchUp );
		state.rotation.y = ( - state.keys.yawRight + state.keys.yawLeft );
		state.rotation.z = ( - state.keys.rollRight + state.keys.rollLeft );
    }
}
