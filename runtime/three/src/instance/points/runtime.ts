import { filter, map, take, pluck, switchMap } from 'rxjs/operators';
import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { BufferGeometry, CanvasTexture, Float32BufferAttribute, Points, PointsMaterial } from 'three';
import { ThreeRuntimeInstance } from './../default/runtime';
import { ThreeStatePoints } from './state';

export class ThreeRuntimePoints extends ThreeRuntimeInstance {

    initialize(state: ThreeStatePoints, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        const geo = new BufferGeometry();
        geo.setAttribute('position', new Float32BufferAttribute(state.vertices, 3));
        const mat = new PointsMaterial(state.params);
        const finalizer = () => {
            state.object$ = new Points(geo, mat);
            return super.initialize(state, state$, action$);
        };
        if (state.resource) {
            return state$.pipe(
                filter((fs) => fs.resource[state.resource] && fs.resource[state.resource].loaded),
                map((fs) => fs.resource[state.resource]),
                take(1),
                pluck('data$'),
                switchMap((texture: any) => {
                    const map = new CanvasTexture(texture);
                    mat.map = map;
                    mat.alphaMap = map;
                    mat.needsUpdate = true;
                    return finalizer();
                })
            );
        }
        return finalizer();
    }
}
