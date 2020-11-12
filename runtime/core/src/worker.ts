import { ogodEpics } from './epics';
import { ogodReducers } from './reducers';
import { Epic } from 'redux-observable';
import { ReducersMapObject } from 'redux';
import { OgodRuntimeEngine, ogodRuntimeEngineDefault } from './engine/runtime';
import { BehaviorSubject, Observable } from 'rxjs';
import { OgodRegistry } from './util/registry';
import { ogodConfigureStore } from './store';


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
    self.registry = registry;
    return runtimeEngine;
}