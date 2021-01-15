import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } from 'three';
import { ThreeRuntimeInstance } from './../default/runtime';
import { ThreeStatePoints } from './state';

export class ThreeRuntimePoints extends ThreeRuntimeInstance {

    initialize(state: ThreeStatePoints, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        const geo = new BufferGeometry();
        geo.setAttribute('position', new Float32BufferAttribute(state.vertices, 3));
        const mat = new PointsMaterial(state.params);
        state.object$ = new Points(geo, mat);
        return super.initialize(state, state$, action$);
    }
}