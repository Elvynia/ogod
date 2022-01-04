import { OgodActionInstance } from '@ogod/common';
import { OgodRuntimeInstanceDefault } from '@ogod/runtime-core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Vector3 } from 'three';
import { ThreeStateInstance } from './state';

export class ThreeRuntimeInstance extends OgodRuntimeInstanceDefault {

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
        if (state.scale) {
            this.updateStateScale(0, state);
        } else {
            state.scale = new Vector3(1, 1, 1);
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
        if (changes.scale) {
            this.updateStateScale(0, all);
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

    updateStateScale(delta: number, state: ThreeStateInstance) {
        state.object$.scale.x = state.scale.x;
        state.object$.scale.y = state.scale.y;
        state.object$.scale.z = state.scale.z;
    }
}
