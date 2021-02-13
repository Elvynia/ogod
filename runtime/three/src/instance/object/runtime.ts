import { OgodActionInstance } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeRuntimeEngine } from '../../engine/runtime';
import { ThreeStateEngine } from '../../engine/state';
import { ThreeRuntimeInstance } from './../default/runtime';
import { ThreeStateObject } from './state';

declare var self: ThreeRuntimeEngine;

export class ThreeRuntimeObject extends ThreeRuntimeInstance {

    initialize(state: ThreeStateObject, state$: Observable<ThreeStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        const path = (self.baseHref + state.path).replace(/\/\//g, '/');
        const loader = new MTLLoader();
        return from(loader.loadAsync(path + '.mtl')).pipe(
            switchMap((materials: MTLLoader.MaterialCreator) => {
                materials.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                return from(objLoader.loadAsync(path + '.obj'));
            }),
            switchMap((object) => super.initializeSuccess({
                ...state,
                object$: object
            } as ThreeStateObject))
        );
    }
}
