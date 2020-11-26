import { OgodActionActor } from './../../../../common/lib/actor/action.d';
import { OgodRuntimeActor } from '@ogod/runtime-core';
import { PixiStateRenderer } from "./state";
import { Observable, of } from "rxjs";
import { PixiStateEngine } from "../engine/state";
import { rendererInitSuccess, rendererDestroySuccess, rendererChangesSuccess } from "./action";
import { filter, take, map, pluck, tap } from "rxjs/operators";
import { ActionsObservable, ofType } from 'redux-observable';
import { engineCanvas } from '@ogod/common';
import { PixiRuntimeEngine } from '../engine/runtime';

declare var self: PixiRuntimeEngine;

export class PixiRuntimeRenderer implements OgodRuntimeActor<PixiStateRenderer, OgodActionActor<PixiStateRenderer>> {

    initialize(state: PixiStateRenderer, state$: Observable<PixiStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionActor<PixiStateRenderer>> {
        const initSuccess = (view) => rendererInitSuccess({
            id: state.id,
            state: {
                ...state,
                renderer$: new PIXI.Renderer({
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
            state.renderer$.resize(changes.width, changes.height);
        }
        return of(rendererChangesSuccess({
            id: state.id,
            changes
        }));
    }

    destroy(state: PixiStateRenderer) {
        return of(rendererDestroySuccess({ id: state.id }));
    }
}