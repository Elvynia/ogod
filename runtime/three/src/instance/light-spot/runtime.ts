import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Color, SpotLight, SpotLightHelper } from 'three';
import { ThreeRuntimeLightPoint } from './../light-point/runtime';
import { ThreeStateLightSpot } from './state';

export class ThreeRuntimeLightSpot extends ThreeRuntimeLightPoint {

    initialize(state: ThreeStateLightSpot, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.object$ = new SpotLight(new Color(state.color), state.intensity, state.distance, state.angle, state.penumbra, state.decay);
        if (state.helper) {
            state.object$.add(new SpotLightHelper(state.object$, new Color(0x0000ff)));
        }
        return super.initializeSuccess(state);
    }

    changes(changes: Partial<ThreeStateLightSpot>, state: ThreeStateLightSpot) {
        const all = { ...state, ...changes };
        if (changes.angle) {
            this.updateStateAngle(0, all);
        }
        if (changes.penumbra) {
            this.updateStatePenumbra(0, all);
        }
        return super.changes(changes, state);
    }

    updateStateAngle(delta, state: ThreeStateLightSpot) {
        state.object$.angle = state.angle;
    }

    updateStatePenumbra(delta, state: ThreeStateLightSpot) {
        state.object$.penumbra = state.penumbra;
    }
}
