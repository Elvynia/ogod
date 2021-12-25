import { OgodActionScene } from '@ogod/common';
import { OgodRuntimeSceneDefault } from '@ogod/runtime-core';
import { Container } from 'pixi.js';
import { ActionsObservable } from 'redux-observable';
import { Observable } from 'rxjs';
import { map, skipWhile, switchMap, take, filter, tap } from 'rxjs/operators';
import { PixiRuntimeEngine } from '../../engine/runtime';
import { PixiStateEngine } from '../../engine/state';
import { PixiStateInstance } from '../../instance/default/state';
import { PixiStateScene } from './state';

declare var self: PixiRuntimeEngine;

export class PixiRuntimeScene extends OgodRuntimeSceneDefault {

    initialize(state: PixiStateScene, state$: Observable<PixiStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionScene> {
        state.container$ = new Container();
        return state$.pipe(
            filter((fs) => fs.renderer?.renderer$ != null),
            map((engine) => engine.scene[state.id]),
            take(1),
            switchMap((initState) => super.initialize({
                ...state,
                ...initState
            }, state$, action$))
        );
    }

    add(state: PixiStateScene, child: PixiStateInstance) {
        super.add(state, child);
        state.container$.addChild(child.instance$);
        state.container$.sortChildren();
    }

    remove(state: PixiStateScene, id: string, child: PixiStateInstance) {
        super.remove(state, id, child);
        if (child && child.instance$) {
            state.container$.removeChild(child.instance$);
        } else {
            state.container$.removeChild(state.container$.getChildByName(id));
        }
    }

    render(state: PixiStateScene) {
        const renderer = self.store.getState().renderer.renderer$;
        renderer.render(state.container$);
    }
}
