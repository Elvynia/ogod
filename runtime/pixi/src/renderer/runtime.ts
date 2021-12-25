import { engineCanvas, OgodActionActor } from '@ogod/common';
import { OgodRuntimeActor } from '@ogod/runtime-core';
import { Renderer } from 'pixi.js';
import { ActionsObservable, ofType } from 'redux-observable';
import { Observable, of } from "rxjs";
import { map, pluck, take, tap } from "rxjs/operators";
import { PixiRuntimeEngine } from '../engine/runtime';
import { PixiStateEngine } from "../engine/state";
import { rendererChangesSuccess, rendererDestroySuccess, rendererInitSuccess } from "./action";
import { PixiStateRenderer } from "./state";

declare var self: PixiRuntimeEngine;

export class PixiRuntimeRenderer implements OgodRuntimeActor<PixiStateRenderer, OgodActionActor<PixiStateRenderer>> {

    initialize(state: PixiStateRenderer, state$: Observable<PixiStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionActor<PixiStateRenderer>> {
        const initSuccess = (view) => rendererInitSuccess({
            id: state.id,
            state: {
                ...state,
                renderer$: new Renderer({
                    ...state,
                    view
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
            tap((canvas) => canvas.style = {}), // FIXME: Pixi Worker support.
            map((view) => initSuccess(view))
        );
    }

    changes(changes: Partial<PixiStateRenderer>, state: PixiStateRenderer): Observable<OgodActionActor<PixiStateRenderer>> {
        if (changes.width || changes.height) {
            state.renderer$.resize(changes.width || state.width, changes.height || state.height);
        }
        return of(rendererChangesSuccess({
            id: state.id,
            changes
        }));
    }

    destroy(state: PixiStateRenderer, state$: Observable<PixiStateEngine>) {
        return of(rendererDestroySuccess({ id: state.id }));
    }
}
