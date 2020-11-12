import { OgodActionScene, OgodStateEngine } from '@ogod/common';
import { OgodRuntimeEngine, OgodRuntimeInstance, OgodRuntimeSceneDefault } from '@ogod/runtime-core';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { D2StateScene } from './state';

declare var self: OgodRuntimeEngine;

export class D2RuntimeScene extends OgodRuntimeSceneDefault {

    initialize(state: D2StateScene, state$: Observable<OgodStateEngine>): Observable<OgodActionScene> {
        if (state.context$) {
            return super.initialize(state, state$);
        }
        return state$.pipe(
            filter((fs) => fs.scene[state.id] && (fs.scene[state.id] as D2StateScene).context$ != null),
            take(1),
            map((fs) => ({
                ...state,
                ...fs.scene[state.id]
            })),
            switchMap((initState) => super.initialize(initState, state$))
        );
    }
    
    nextCanvas(state: D2StateScene, canvas: OffscreenCanvas, lastCanvas: OffscreenCanvas): Partial<D2StateScene> {
        return {
            context$: canvas.getContext('2d')
        };
    }

    render(state: D2StateScene) {
        if (state.clear) {
            state.context$.clearRect(0, 0, state.context$.canvas.width, state.context$.canvas.height);
        }
        if (state.bgColor) {
            state.context$.fillStyle = state.bgColor;
            state.context$.fillRect(0, 0, state.context$.canvas.width, state.context$.canvas.height);
        }
        const fullState = self.store.getState();
        state.entities
            .map((key) => [key, self.runtimes['instance'][key]] as [string, OgodRuntimeInstance])
            .forEach(([key, child]) => (child as any).render(state.context$, fullState.instance[key]));
    }
}
