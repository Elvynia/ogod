import { OgodActionInstance } from '@ogod/common';
import { OgodRuntimeInstanceDefault } from '@ogod/runtime-core';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Vector3 } from 'three';
import { ThreeStateInstance } from './state';

export class ThreeRuntimeInstance extends OgodRuntimeInstanceDefault {

    initialize(state: any, state$: Observable<any>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        return this.initializeSuccess(state);
    }

    initializeSuccess(state: ThreeStateInstance): Observable<OgodActionInstance> {
        state.object$.name = state.id;
        if (state.position) {
            this.updateStatePosition(0, state);
        } else {
            state.position = new Vector3();
        }
        if (state.rotation) {
            this.updateStateRotation(0, state);
        } else {
            state.rotation = new Vector3();
        }
        return super.initializeSuccess(state);
    }

    changes(changes: Partial<ThreeStateInstance>, state: ThreeStateInstance) {
        const all = { ...state, ...changes };
        if (changes.position) {
            this.updateStatePosition(0, all);
        }
        if (changes.rotation) {
            this.updateStateRotation(0, all);
        }
        return super.changes(changes, state);
    }

    update(delta: number, state: ThreeStateInstance) {
        if (state.translator) {
            state.object$.position.x += delta * state.translator.x / 1000;
            state.object$.position.y += delta * state.translator.y / 1000;
            state.object$.position.z += delta * state.translator.z / 1000;
        }
        if (state.rotator) {
            state.object$.rotation.x += delta * state.rotator.x / 1000;
            state.object$.rotation.y += delta * state.rotator.y / 1000;
            state.object$.rotation.z += delta * state.rotator.z / 1000;
        }
    }

    updateStatePosition(delta: number, state: ThreeStateInstance) {
        state.object$.position.x = state.position.x;
        state.object$.position.y = state.position.y;
        state.object$.position.z = state.position.z;
    }

    updateStateRotation(delta: number, state: ThreeStateInstance) {
        state.object$.rotation.x = state.rotation.x;
        state.object$.rotation.y = state.rotation.y;
        state.object$.rotation.z = state.rotation.z;
    }
}
