import { OgodActionScene } from '@ogod/common';
import { OgodRuntimeSceneDefault } from "@ogod/runtime-core";
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Color, PerspectiveCamera, Scene } from "three";
import { ThreeRuntimeEngine } from '../../engine/runtime';
import { ThreeStateEngine } from '../../engine/state';
import { ThreeStateInstance } from '../../instance/default/state';
import { ThreeStateScene } from "./state";

declare var self: ThreeRuntimeEngine;

export class ThreeRuntimeScene extends OgodRuntimeSceneDefault {

    initialize(state: ThreeStateScene, state$: Observable<ThreeStateEngine>): Observable<OgodActionScene> {
        state.scene$ = new Scene();
        state.scene$.background = new Color(state.background);
        let ratio = state.camera.ratio;
        if (ratio === 0) {
            ratio = self.canvas.width / self.canvas.height;
        }
        state.camera$ = new PerspectiveCamera(state.camera.fov, ratio, state.camera.near, state.camera.far);
        if (state.camera.position) {
            state.camera$.position.set(state.camera.position.x, state.camera.position.y, state.camera.position.z);
        }
        return state$.pipe(
            filter((fs) => fs.renderer?.loaded),
            map((engine) => engine.scene[state.id]),
            take(1),
            switchMap((initState) => super.initialize({
                ...state,
                ...initState
            }, state$))
        );
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
}
