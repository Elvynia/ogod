import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Color, AmbientLight } from 'three';
import { ThreeRuntimeInstance } from '../default/runtime';
import { ThreeStateLight } from '../light/state';

export class ThreeRuntimeLightAmbient extends ThreeRuntimeInstance {

    initialize(state: ThreeStateLight, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.object$ = new AmbientLight(new Color(state.color), state.intensity);
        return super.initializeSuccess(state);
    }

    changes(changes: Partial<ThreeStateLight>, state: ThreeStateLight) {
        const all = { ...state, ...changes };
        if (changes.color) {
            this.updateStateColor(0, all);
        }
        if (changes.intensity) {
            this.updateStateIntensity(0, all);
        }
        return super.changes(changes, state);
    }

    updateStateColor(delta, state: ThreeStateLight) {
        state.object$.color = new Color(state.color);
    }

    updateStateIntensity(delta, state: ThreeStateLight) {
        state.object$.intensity = state.intensity;
    }
}
