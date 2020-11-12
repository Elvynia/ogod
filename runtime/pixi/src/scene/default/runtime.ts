import { skipWhile, map, take, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OgodRuntimeSceneDefault } from '@ogod/runtime-core';
import { PixiStateScene } from './state';
import { OgodStateEngine, OgodActionScene } from '@ogod/common';
import { PixiStateInstance } from '../../instance/default/state';

export class PixiRuntimeScene extends OgodRuntimeSceneDefault {

    initialize(state: PixiStateScene, state$: Observable<OgodStateEngine>): Observable<OgodActionScene> {
        state.container$ = new PIXI.Container();
        if (state.renderer$) {
            return super.initialize(state, state$);
        }
        return state$.pipe(
            skipWhile((engine) => (engine.scene[state.id] as PixiStateScene).renderer$ != null),
            map((engine) => engine.scene[state.id]),
            take(1),
            switchMap((initState) => super.initialize({
                ...state,
                ...initState
            }, state$))
        );
    }

    nextCanvas(state: PixiStateScene, canvas: OffscreenCanvas, lastCanvas: OffscreenCanvas): Partial<PixiStateScene> {
        // FIXME: Pixi Worker support.
        (canvas as any).style = {};
        return {
            renderer$: new PIXI.Renderer({
                ...state.renderer,
                view: canvas as any
            })
        };
    }

    add(state: PixiStateScene, child: PixiStateInstance) {
        state.container$.addChild(child.instance$);
        state.container$.sortChildren();
    }

    remove(state: PixiStateScene, id: string, child: PixiStateInstance) {
        if (child && child.instance$) {
            state.container$.removeChild(child.instance$);
        } else {
            state.container$.removeChild(state.container$.getChildByName(id));
        }
    }

    render(state: PixiStateScene) {
        state.renderer$.render(state.container$);
    }
}
