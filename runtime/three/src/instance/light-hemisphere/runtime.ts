import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Color, HemisphereLight } from 'three';
import { ThreeRuntimeLightAmbient } from './../light-ambient/runtime';
import { ThreeStateLightHemisphere } from './state';

export class ThreeRuntimeLightHemisphere extends ThreeRuntimeLightAmbient {

    initialize(state: ThreeStateLightHemisphere, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.object$ = new HemisphereLight(new Color(state.color), new Color(state.groundColor), state.intensity);
        return super.initializeSuccess(state);
    }

    changes(changes: Partial<ThreeStateLightHemisphere>, state: ThreeStateLightHemisphere) {
        const all = { ...state, ...changes };
        if (changes.groundColor) {
            this.updateStateGroundColor(0, all);
        }
        return super.changes(changes, state);
    }

    updateStateGroundColor(delta, state: ThreeStateLightHemisphere) {
        state.object$.groundColor = new Color(state.groundColor);
    }
}
