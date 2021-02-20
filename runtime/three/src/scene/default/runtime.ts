import { engineCanvasResize, OgodActionScene } from '@ogod/common';
import { OgodRuntimeSceneDefault } from "@ogod/runtime-core";
import { ActionsObservable, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Color, PerspectiveCamera, Scene } from "three";
import { ThreeRuntimeEngine } from '../../engine/runtime';
import { ThreeStateEngine } from '../../engine/state';
import { ThreeStateInstance } from '../../instance/default/state';
import { ThreeStateScene } from "./state";

declare var self: ThreeRuntimeEngine;

export class ThreeRuntimeScene extends OgodRuntimeSceneDefault {

    initialize(state: ThreeStateScene, state$: Observable<ThreeStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionScene> {
        state.scene$ = new Scene();
        // FIXME: state.scene$.autoUpdate from state value.
        if (state.background) {
            this.updateStateBackground(0, state);
        }
        let aspectRatio = state.camera.ratio;
        if (aspectRatio === 0) {
            aspectRatio = self.canvas.width / self.canvas.height;
        }
        state.camera$ = new PerspectiveCamera(state.camera.fov, aspectRatio, state.camera.near, state.camera.far);
        if (state.camera.position) {
            state.camera$.position.set(state.camera.position.x, state.camera.position.y, state.camera.position.z);
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
