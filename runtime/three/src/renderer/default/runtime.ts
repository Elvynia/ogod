import { engineCanvas, OgodActionActor } from '@ogod/common';
import { OgodRuntimeActor } from '@ogod/runtime-core';
import { ActionsObservable, ofType } from 'redux-observable';
import { Observable, of } from "rxjs";
import { map, pluck, take, tap } from "rxjs/operators";
import { WebGLRenderer } from 'three';
import { ThreeRuntimeEngine } from '../../engine/runtime';
import { ThreeStateEngine } from "../../engine/state";
import { rendererChangesSuccess, rendererDestroySuccess, rendererInitSuccess } from "../action";
import { ThreeStateRenderer } from "./state";

declare var self: ThreeRuntimeEngine;

export class ThreeRuntimeRenderer implements OgodRuntimeActor<ThreeStateRenderer, OgodActionActor<ThreeStateRenderer>> {

    initialize(state: ThreeStateRenderer, state$: Observable<ThreeStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionActor<ThreeStateRenderer>> {
        const initSuccess = (canvas) => rendererInitSuccess({
            id: state.id,
            state: {
                ...state,
                renderer$: new WebGLRenderer({
                    ...state,
                    canvas
                })
            }
        });
        if (self.canvas) {
            (self.canvas as any).style = {}
            return of(initSuccess(self.canvas));
        }
        return action$.pipe(
            ofType(engineCanvas.type),
            take(1),
            pluck('canvas'),
            map((view) => initSuccess(view))
        );
    }

    changes(changes: Partial<ThreeStateRenderer>, state: ThreeStateRenderer): Observable<OgodActionActor<ThreeStateRenderer>> {
        // if (changes.width || changes.height) {
        //     state.renderer$.setSize(changes.width, changes.height);
        // }
        return of(rendererChangesSuccess({
            id: state.id,
            changes
        }));
    }

    destroy(state: ThreeStateRenderer) {
        return of(rendererDestroySuccess({ id: state.id }));
    }
}