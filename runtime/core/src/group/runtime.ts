import { instanceInitSuccess, instanceStart, OgodActionActor, OgodActionInstance, OgodStateEngine, OgodStateGroup, OgodStateInstance } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ogodContainerUpdate$, OgodRuntimeContainer } from '../container/runtime';
import { OgodRuntimeEngine } from '../engine/runtime';
import { ogodReactiveUpdate } from '../util/reactive-update';
import { OgodRuntimeInstanceDefault } from './../instance/runtime';

declare var self: OgodRuntimeEngine;

export function ogodContainerUpdateGroup$(state: OgodStateGroup, state$: Observable<OgodStateEngine>) {
    return ogodContainerUpdate$((source: Observable<[number, OgodStateInstance[]]>) => source.pipe(
        map(([delta, instances]) => {
            // console.log(instances.map((i) => i.id));
            return instances
            .filter((instance: OgodStateInstance) => instance.groups?.indexOf(state.id) >= 0);
        }
        )), state, state$);
}

export class OgodRuntimeGroupDefault extends OgodRuntimeInstanceDefault implements OgodRuntimeContainer<OgodStateGroup, any> {

    initialize(state: OgodStateGroup, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        return of(instanceInitSuccess({
            id: state.id,
            state: {
                ...state,
                entities: state.entities || [],
                sub$: {},
                loading: false,
                loaded: true
            } as OgodStateGroup
        }));
    }

    start(state: OgodStateGroup, state$: Observable<OgodStateEngine>): OgodActionActor<OgodStateInstance> {
        console.log('[GROUP] Start', state.id);
        state.running = true;
        state.sub$['ogodContainerUpdate'] = ogodContainerUpdateGroup$(state, state$).subscribe(({ added, removed }) => {
            added.forEach((instance: OgodStateInstance) => {
                this.add(state, instance);
            });
            removed.forEach((id) => {
                const instance = self.store.getState().instance[id] as OgodStateInstance;
                this.remove(state, id, instance);
            });
        });
        state.sub$['ogodReactiveUpdate'] = ogodReactiveUpdate(this, state);
        return instanceStart({
            id: state.id,
            state
        });
    }

    add(state: OgodStateGroup, child: OgodStateInstance): void {
        console.log('[GROUP] Add %s to %s', child.id, state.id);
        state.entities.push(child.id);
    }

    remove(state: OgodStateGroup, id: string, child: OgodStateInstance): void {
        console.log('[GROUP] Remove %s from %s', id, state.id);
        state.entities.splice(state.entities.findIndex((key) => key === id), 1);
    }
}
