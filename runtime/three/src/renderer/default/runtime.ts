import { engineCanvas, engineCanvasResize, OgodActionActor } from '@ogod/common';
import { OgodRuntimeActor } from '@ogod/runtime-core';
import { ActionsObservable, ofType } from 'redux-observable';
import { Observable, of } from "rxjs";
import { filter, first, map, pluck, switchMap, take, tap } from "rxjs/operators";
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
        action$.pipe(
            ofType(engineCanvasResize.type),
            switchMap(({ width, height }) => state$.pipe(
                filter((fs) => !!fs.renderer.renderer$),
                map((fs) => fs.renderer.renderer$),
                first(),
                map((renderer) => [renderer, width, height])
            ))
        ).subscribe(([renderer, width, height]) => {
            renderer.setSize(width, height, false);
        });
        if (self.canvas) {
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
        return of(rendererChangesSuccess({
            id: state.id,
            changes
        }));
    }

    destroy(state: ThreeStateRenderer) {
        return of(rendererDestroySuccess({ id: state.id }));
    }
}
