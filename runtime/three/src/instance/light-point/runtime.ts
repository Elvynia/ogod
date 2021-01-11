import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Color, PointLight, PointLightHelper } from 'three';
import { ThreeRuntimeInstance } from '../default/runtime';
import { ThreeStateLightPoint } from './state';

export class ThreeRuntimeLightPoint extends ThreeRuntimeInstance {

    initialize(state: ThreeStateLightPoint, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.object$ = new PointLight(new Color(state.color), state.intensity, state.distance, state.decay);
        // state.object$.add(new PointLightHelper(state.object$ as any, 0.1, new Color(0x0000ff)));
        return super.initialize(state, state$, action$);
    }
}
