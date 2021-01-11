import { Observable } from 'rxjs';
import { OgodRuntimeInstanceDefault } from '@ogod/runtime-core';
import { ThreeStateInstance } from './state';
import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';

export class ThreeRuntimeInstance extends OgodRuntimeInstanceDefault {

    initialize(state: ThreeStateInstance, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        if (state.position) {
            this.updateStateX(0, state);
            this.updateStateY(0, state);
            this.updateStateZ(0, state);
        }
        return super.initialize(state, state$, action$);
    }

    update(delta: number, state: ThreeStateInstance) {
        if (state.rotation) {
            state.object$.rotation.x += delta * state.rotation.x / 1000;
            state.object$.rotation.y += delta * state.rotation.y / 1000;
            state.object$.rotation.z += delta * state.rotation.z / 1000;
        }
    }

    updateStateX(delta: number, state: ThreeStateInstance) {
        state.object$.position.x = state.position.x;
    }

    updateStateY(delta: number, state: ThreeStateInstance) {
        state.object$.position.y = state.position.y;
    }

    updateStateZ(delta: number, state: ThreeStateInstance) {
        state.object$.position.z = state.position.z;
    }
}
