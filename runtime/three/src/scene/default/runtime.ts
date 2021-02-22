import { engineCanvasResize, OgodActionScene } from '@ogod/common';
import { OgodRuntimeSceneDefault } from "@ogod/runtime-core";
import { ActionsObservable, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Color, PerspectiveCamera, Scene, Vector3 } from "three";
import { ThreeRuntimeEngine } from '../../engine/runtime';
import { ThreeStateEngine } from '../../engine/state';
import { ThreeStateInstance } from '../../instance/default/state';
import { threeCreateCamera } from '../camera/runtime';
import { threeCreateFog } from '../fog/runtime';
import { ThreeStateScene } from "./state";

declare var self: ThreeRuntimeEngine;

export class ThreeRuntimeScene extends OgodRuntimeSceneDefault {

    initialize(state: ThreeStateScene, state$: Observable<ThreeStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionScene> {
        state.scene$ = new Scene();
        // FIXME: state.scene$.autoUpdate from state value.
        if (state.background) {
            this.updateStateBackground(0, state);
        }
        if (state.camera) {
            state.camera$ = threeCreateCamera(state.camera);
        }
        if (state.fog) {
            state.scene$.fog = threeCreateFog(state.fog);
        }
        action$.pipe(
            ofType(engineCanvasResize.type),
        ).subscribe(({ width, height }) => {
            if (state.camera$) {
                state.camera$.aspect = width / height;
                state.camera$.updateProjectionMatrix();
            }
        });
        return state$.pipe(
            filter((fs) => fs.renderer?.loaded),
            map((engine) => engine.scene[state.id]),
            take(1),
            switchMap((initState) => super.initialize({
                ...state,
                ...initState
            }, state$, action$))
        );
    }

    changes(changes: Partial<ThreeStateScene>, state: ThreeStateScene) {
        if (changes.background) {
            this.updateStateBackground(0, { ...state, ...changes });
        }
        return super.changes(changes, state);
    }

    add(state: ThreeStateScene, child: ThreeStateInstance) {
        super.add(state, child);
        state.scene$.add(child.object$);
    }

    remove(state: ThreeStateScene, id: string, child: ThreeStateInstance) {
        super.remove(state, id, child);
        if (child && child.object$) {
            state.scene$.remove(child.object$);
        } else {
            state.scene$.remove(state.scene$.getObjectByName(id));
        }
    }

    render(state: ThreeStateScene) {
        const renderer = self.store.getState().renderer.renderer$;
        renderer.render(state.scene$, state.camera$);
    }

    updateStateBackground(delta: number, state: ThreeStateScene) {
        state.scene$.background = new Color(state.background || 'grey');
    }
}
