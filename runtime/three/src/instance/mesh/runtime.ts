import { OgodActionInstance, OgodStateEngine } from "@ogod/common";
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap, take } from 'rxjs/operators';
import { CanvasTexture, Mesh } from 'three';
import { threeCreateGeometry } from "../geometry/runtime";
import { threeCreateMaterial } from "../material/runtime";
import { ThreeRuntimeInstance } from './../default/runtime';
import { ThreeStateMesh } from "./state";

export class ThreeRuntimeMesh extends ThreeRuntimeInstance {

    initialize(state: ThreeStateMesh, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        const geo = threeCreateGeometry(state.geometry);
        const mat = threeCreateMaterial(state.material);
        const finalizer = () => {
            state.object$ = new Mesh(geo, mat);
            return super.initialize(state, state$, action$);
        };
        if (state.resource) {
            return state$.pipe(
                filter((fs) => fs.resource[state.resource] && fs.resource[state.resource].loaded),
                map((fs) => fs.resource[state.resource]),
                take(1),
                pluck('data$'),
                switchMap((texture: any) => {
                    mat.map = new CanvasTexture(texture);
                    return finalizer();
                })
            );
        }
        return finalizer();
    }
}
