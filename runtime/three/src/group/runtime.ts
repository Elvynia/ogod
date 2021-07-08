import { ThreeRuntimeInstance } from './../instance/default/runtime';
import { instanceStart, OgodActionActor, OgodActionInstance, OgodStateEngine, OgodStateInstance } from '@ogod/common';
import { ogodContainerUpdateGroup$, ogodReactiveUpdate, OgodRuntimeContainer, OgodRuntimeEngine, OgodRuntimeGroupDefault } from '@ogod/runtime-core';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { Group } from 'three';
import { ThreeStateInstance } from './../instance/default/state';
import { ThreeStateGroup } from './state';
import { map, first, filter } from 'rxjs/operators';

declare var self: OgodRuntimeEngine;

// FIXME: Use Mixin with OgodRuntimeGroup.
export class ThreeRuntimeGroup extends ThreeRuntimeInstance implements OgodRuntimeContainer<ThreeStateGroup, any> {

    initialize(state: ThreeStateGroup, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        state.object$ = new Group();
        return this.initializeSuccess({
            ...state,
            entities: state.entities || [],
            sub$: {},
            loading: false,
            loaded: true
        } as ThreeStateGroup);
    }

    start(state: ThreeStateGroup, state$: Observable<OgodStateEngine>): OgodActionActor<OgodStateInstance> {
        console.log('[GROUP] Start', state.id);
        state.running = true;
        state.sub$['ogodContainerUpdate'] = ogodContainerUpdateGroup$(state, state$).subscribe(({ added, removed }) => {
            added.forEach((instance: ThreeStateInstance) => {
                this.add(state, instance);
            });
            removed.forEach((id) => {
                const instance = self.store.getState().instance[id] as ThreeStateInstance;
                this.remove(state, id, instance);
            });
        });
        state.sub$['ogodReactiveUpdate'] = ogodReactiveUpdate(this, state);
        return instanceStart({
            id: state.id,
            state
        });
    }

    add(state: ThreeStateGroup, child: ThreeStateInstance): void {
        console.log('[GROUP] Add %s to %s', child.id, state.id);
        if (child.loaded) {
            state.object$.add(child.object$);
        } else {
            self.state$.pipe(
                map((s) => s.instance[child.id]),
                filter((s) => s?.loaded),
                first()
            ).subscribe((loadedChild: any) => state.object$.add(loadedChild.object$));
        }
        state.entities.push(child.id);
    }

    remove(state: ThreeStateGroup, id: string, child: ThreeStateInstance): void {
        console.log('[GROUP] Remove %s from %s', id, state.id);
        state.object$.remove(child.object$);
        state.entities.splice(state.entities.findIndex((key) => key === id), 1);
    }
}
