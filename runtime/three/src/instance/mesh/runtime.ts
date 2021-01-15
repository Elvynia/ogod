import { OgodActionInstance, OgodStateEngine } from "@ogod/common";
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Mesh } from 'three';
import { threeCreateGeometry } from "../geometry/runtime";
import { threeCreateMaterial } from "../material/runtime";
import { ThreeRuntimeInstance } from './../default/runtime';
import { ThreeStateMesh } from "./state";

export class ThreeRuntimeMesh extends ThreeRuntimeInstance {

    initialize(state: ThreeStateMesh, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        const geo = threeCreateGeometry(state.geometry);
        const mat = threeCreateMaterial(state.material);
        state.object$ = new Mesh(geo, mat);
        return super.initialize(state, state$, action$);
    }
}
