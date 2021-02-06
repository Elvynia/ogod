import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Color, PointLight, PointLightHelper } from 'three';
import { ThreeRuntimeLightAmbient } from './../light-ambient/runtime';
import { ThreeStateLightPoint } from './state';

export class ThreeRuntimeLightPoint extends ThreeRuntimeLightAmbient {

    initialize(state: ThreeStateLightPoint, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.object$ = new PointLight(new Color(state.color), state.intensity, state.distance, state.decay);
        if (state.helper) {
            state.object$.add(new PointLightHelper(state.object$, 0.2, new Color(0x0000ff)));
        }
        return super.initializeSuccess(state);
    }

    changes(changes: Partial<ThreeStateLightPoint>, state: ThreeStateLightPoint) {
        const all = { ...state, ...changes };
        if (changes.distance) {
            this.updateStateDistance(0, all);
        }
        if (changes.decay) {
            this.updateStateDecay(0, all);
        }
        return super.changes(changes, state);
    }

    updateStateDistance(delta, state: ThreeStateLightPoint) {
        console.log('UPDATE DISTANCE FROM %s TO %s', state.object$.distance, state.distance)
        state.object$.distance = state.distance;
    }

    updateStateDecay(delta, state: ThreeStateLightPoint) {
        state.object$.decay = state.decay;
    }
}
