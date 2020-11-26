import { OgodStore, OgodStateEngine } from "@ogod/common";
import { EpicMiddleware, createEpicMiddleware, combineEpics, Epic } from "redux-observable";
import { Action, createStore, combineReducers, applyMiddleware, ReducersMapObject } from "redux";
import { epicDebugActions } from "./engine/epic";
import { OgodRuntimeEngine } from "./engine/runtime";

declare var self: OgodRuntimeEngine;

export function ogodConfigureStore(reducers: ReducersMapObject, epics: Epic[]): OgodStore {
    const epicMiddleware: EpicMiddleware<Action, Action, OgodStateEngine, any> = createEpicMiddleware();
    const store: any = createStore(combineReducers({
        ...reducers
    }), {}, applyMiddleware(epicMiddleware));
    store.asyncReducers = {};
    store.injectReducer = (key, asyncReducer) => {
        store.asyncReducers[key] = asyncReducer;
        store.replaceReducer(combineReducers({
            ...reducers,
            ...store.asyncReducers
        }));
    };
    if (self.debugMode) {
        epicMiddleware.run(combineEpics(epicDebugActions, ...epics))
    } else {
        epicMiddleware.run(combineEpics(...epics));
    }
    return store;
}
