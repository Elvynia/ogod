import { OgodActionScene } from '@ogod/common';
import { OgodRuntimeInstance, OgodRuntimeSceneDefault } from '@ogod/runtime-core';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter, switchMapTo, take } from 'rxjs/operators';
import { D2RuntimeEngine } from '../../engine/runtime';
import { D2StateEngine } from '../../engine/state';
import { D2StateScene } from './state';

declare var self: D2RuntimeEngine;

export class D2RuntimeScene extends OgodRuntimeSceneDefault {

    initialize(state: D2StateScene, state$: Observable<D2StateEngine>, action$: ActionsObservable<any>): Observable<OgodActionScene> {
        if (self.store.getState().context$) {
            super.initialize(state, state$, action$);
        }
        return state$.pipe(
            filter((fs) => fs.context$ != null),
            take(1),
            switchMapTo(super.initialize(state, state$, action$))
        );
    }

    render(state: D2StateScene) {
        const context = self.store.getState().context$;
        if (state.clear) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
        if (state.bgColor) {
            context.fillStyle = state.bgColor;
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }
        const fullState = self.store.getState();
        state.entities
            .map((key) => [key, self.getRuntime('instance', key)] as [string, OgodRuntimeInstance])
            .forEach(([key, child]) => child && (child as any).render(context, fullState.instance[key]));
    }
}
