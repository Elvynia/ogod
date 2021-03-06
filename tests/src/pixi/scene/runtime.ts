import { OgodActionScene, OgodStateEngine } from '@ogod/common';
import { Box2dRuntimeDebug, WORLD_RATIO } from "@ogod/runtime-box2d";
import { OgodStateWorld } from '@ogod/runtime-core';
import { PixiStateScene, PixiRuntimeEngine } from '@ogod/runtime-pixi';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { PixiStateDebugBox2d } from "./state";

declare var self: PixiRuntimeEngine;

export class PixiRuntimeDebugBox2d extends Box2dRuntimeDebug {

    initialize(state: PixiStateDebugBox2d, state$: Observable<OgodStateEngine>): Observable<OgodActionScene> {
        return state$.pipe(
            filter((fs) => Object.keys(fs.scene).length > 0),
            map((fs) => Object.values(fs.scene)[0]),
            take(1),
            map((scene: PixiStateScene) => ({
                ...state,
                graphics$: new PIXI.Graphics()
            })),
            switchMap((initState) => state$.pipe(
                filter((fs) => fs.system[state.worldId] && !!(fs.system[state.worldId] as OgodStateWorld).camera),
                map((fs) => (fs.system[state.worldId] as OgodStateWorld).camera),
                take(1),
                map((camera) => ({
                    ...initState,
                    camera
                }))
            )),
            switchMap((initState) => super.initialize(initState, state$))
        );
    }

    render(state: PixiStateDebugBox2d) {
        const renderer = self.store.getState().renderer.renderer$;
        renderer.render(state.graphics$, null, false);
    }

    update(delta: number, state: PixiStateDebugBox2d) {
        super.update(delta, state);
        state.graphics$.clear();
        const camX = state.camera.x - state.camera.worldX;
        const camY = state.camera.y + state.camera.height + state.camera.worldY;
        for (let g of Object.values(state.graphics)) {
            state.graphics$.beginFill(0xFF0000, 0.6);
            state.graphics$.lineStyle(1, 0xFF0000, 1);
            if (g.radius) {
                state.graphics$.drawCircle(g.x, g.y, g.radius);
            } else {
                state.graphics$.moveTo(camX + g.position.x + g.vertices[0].x * WORLD_RATIO, camY - g.position.y - g.vertices[0].y * WORLD_RATIO);
                for (let i = 1; i < g.vertices.length; i++) {
                    state.graphics$.lineTo(camX + g.position.x + g.vertices[i].x * WORLD_RATIO, camY - g.position.y - g.vertices[i].y * WORLD_RATIO);
                }
                state.graphics$.closePath();
            }
            state.graphics$.endFill();
        }
        const minX = state.camera.x + state.camera.offset.minX;
        const minY = state.camera.y + state.camera.height - state.camera.offset.minY;
        const maxX = state.camera.x + state.camera.offset.maxX;
        const maxY = state.camera.y  + state.camera.height - state.camera.offset.maxY;
        state.graphics$.drawRect(minX, minY,
            maxX - minX, maxY - minY);
    }
}
