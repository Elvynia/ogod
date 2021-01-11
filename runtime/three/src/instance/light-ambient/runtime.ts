import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Color, AmbientLight } from 'three';
import { ThreeRuntimeInstance } from '../default/runtime';
import { ThreeStateLight } from '../light/state';

export class ThreeRuntimeLightAmbient extends ThreeRuntimeInstance {

    initialize(state: ThreeStateLight, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.object$ = new AmbientLight(new Color(state.color), state.intensity);
        return super.initialize(state, state$, action$);
    }
}
