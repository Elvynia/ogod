import { ReducersMapObject } from 'redux';
import { Epic } from 'redux-observable';
import { BehaviorSubject, Observable } from 'rxjs';
import { OgodRuntimeEngine, ogodRuntimeEngineDefault } from './engine/runtime';
import { ogodEpics } from './epics';
import { ogodReducers } from './reducers';
import { ogodConfigureStore } from './store';
import { OgodRegistry, OgodRuntimeRegistry } from './util/registry';


declare var self: OgodRuntimeEngine;

export const ogodWorkerStream = (registry: OgodRegistry, baseHref: string = '/',
    intervalUpdate: number = 1 / 60, reducers: ReducersMapObject = ogodReducers,
    epics: Epic[] = ogodEpics, runtimeEngine = ogodRuntimeEngineDefault) => {
    self.store = ogodConfigureStore(reducers, epics);
    self.state$ = new BehaviorSubject(self.store.getState());
    new Observable(function (observer) {
        observer.next(self.store.getState());
        const unsubscribe = self.store.subscribe(function () {
            observer.next(self.store.getState());
        });
        return unsubscribe;
    }).subscribe(self.state$);
    self.baseHref = baseHref;
    self.intervalUpdate = intervalUpdate;
    self.registry = new OgodRuntimeRegistry(registry);
    return runtimeEngine;
}