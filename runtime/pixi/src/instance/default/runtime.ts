import { PixiStateResource } from './../../resource/default/state';
import { OgodRuntimeInstanceDefault } from '@ogod/runtime-core';
import { tap, switchMap, pluck, take, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PixiStateInstance } from './state';
import { OgodActionInstance, OgodStateEngine } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';

export function waitForResource<T extends PixiStateResource>(state: PixiStateInstance, state$: Observable<OgodStateEngine>): Observable<T['data$']> {
    return state$.pipe(
        filter((engine) => engine.resource[state.resource] && engine.resource[state.resource].loaded),
        map((engine) => engine.resource[state.resource] as T),
        take(1),
        pluck('data$')
    );
}

export abstract class PixiRuntimeInstance extends OgodRuntimeInstanceDefault {

    initialize(state: PixiStateInstance, state$: Observable<OgodStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        return this.initializeSprite(state, state$).pipe(
            tap((initState) => this.initializeProperties(initState)),
            switchMap((initState) => super.initialize(initState, state$, action$))
        );
    }

    abstract initializeSprite(state: PixiStateInstance, state$: Observable<OgodStateEngine>): Observable<PixiStateInstance>;

    initializeProperties(state: PixiStateInstance) {
        state.instance$.name = state.id;
        this.updateStateX(0, state);
        this.updateStateY(0, state);
        this.updateStateRotation(0, state);
        this.updateStateIndex(0, state);
        if (state.scale != null) {
            this.updateStateScale(0, state);
        } else {
            this.updateStateScaleX(0, state);
            this.updateStateScaleY(0, state);
        }
    }

    updateStateX(_, state: PixiStateInstance) {
        state.instance$.position.x = state.x;
    }

    updateStateY(_, state: PixiStateInstance) {
        state.instance$.position.y = state.y;
    }

    updateStateRotation(_, state: PixiStateInstance) {
        state.instance$.rotation = state.rotation;
    }

    updateStateScale(_, state: PixiStateInstance) {
        state.scaleX = state.scale;
        state.scaleY = state.scale;
        this.updateStateScaleX(_, state);
        this.updateStateScaleY(_, state);
    }

    updateStateScaleX(_, state: PixiStateInstance) {
        state.instance$.scale.x = state.scaleX;
    }

    updateStateScaleY(_, state: PixiStateInstance) {
        state.instance$.scale.y = state.scaleY;
    }

    updateStateIndex(_, state: PixiStateInstance) {
        state.instance$.zIndex = state.index;
    }

    destroy(state: PixiStateInstance, state$: Observable<OgodStateEngine>): Observable<OgodActionInstance> {
        // FIXME: Options for children/textures ?
        state.instance$.destroy();
        return super.destroy(state, state$);
    }
}
