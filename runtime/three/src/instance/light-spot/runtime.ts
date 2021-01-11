import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Color, SpotLight, SpotLightHelper } from 'three';
import { ThreeRuntimeInstance } from '../default/runtime';
import { ThreeStateLightSpot } from './state';

export class ThreeRuntimeLightSpot extends ThreeRuntimeInstance {

    initialize(state: ThreeStateLightSpot, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.object$ = new SpotLight(new Color(state.color), state.intensity, state.distance, state.angle, state.penumbra, state.decay);
        // state.object$.add(new SpotLightHelper(state.object$ as any, new Color(0x0000ff)));
        return super.initialize(state, state$, action$);
    }
}
