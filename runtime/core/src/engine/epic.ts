import {
    engineReflectChanges, instanceChangesSuccess, instanceInitSuccess, OgodActionActor, OgodStateEngine,
    resourceInitSuccess, sceneChangesSuccess, sceneInitSuccess,
    systemChangesSuccess, systemInitSuccess
} from "@ogod/common";
import { Epic, ofType } from "redux-observable";
import { animationFrameScheduler, EMPTY } from "rxjs";
import { bufferTime, filter, switchMapTo, tap } from "rxjs/operators";
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
    switchMapTo(EMPTY)
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
    switchMapTo(EMPTY)
)
