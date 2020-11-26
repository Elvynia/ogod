import { Epic, ofType } from "redux-observable";
import {
    OgodActionActor, OgodStateEngine, systemInitSuccess, sceneInitSuccess,
    instanceInitSuccess, sceneChangesSuccess, instanceChangesSuccess, systemChangesSuccess,
    resourceInitSuccess, engineReflectChanges
} from "@ogod/common";
import { tap, switchMapTo, bufferTime, filter } from "rxjs/operators";
import { empty, animationFrameScheduler } from "rxjs";
import { OgodRuntimeEngine } from './runtime';

declare var self: OgodRuntimeEngine;

export function removeTransients(state: any): any {
    return Object.keys(state)
        .filter((prop) => !prop.endsWith('$'))
        .map((prop) => ({ [prop]: state[prop] }))
        .reduce((a, b) => Object.assign(b, a), {});
}

export const epicDebugActions: Epic<OgodActionActor<any>, any, OgodStateEngine> = (action$) => action$.pipe(
    tap((action: any) => {
        console.log(action.type, action.id, action.state || action.changes || action.sceneId);
    }),
    switchMapTo(empty())
);

export const epicEngineReflectChanges: Epic<OgodActionActor<any>, any, OgodStateEngine> = (action$) => action$.pipe(
    ofType(systemInitSuccess.type, sceneInitSuccess.type, instanceInitSuccess.type,
        systemChangesSuccess.type, sceneChangesSuccess.type, instanceChangesSuccess.type,
        resourceInitSuccess.type),
    bufferTime(self.intervalUpdate, animationFrameScheduler),
    filter((actions) => actions.length > 0),
    tap((actions) => self.postMessage(engineReflectChanges({
        states: actions.map(({ id, state, changes }) => ({ id: id || state.id, state: changes || removeTransients(state) }))
    }))),
    switchMapTo(empty())
)
