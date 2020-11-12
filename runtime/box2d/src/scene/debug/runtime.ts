import { b2PolygonShape, b2Vec2, b2CircleShape } from '@flyover/box2d';
import { OgodActionScene, OgodStateEngine } from "@ogod/common";
import { OgodRuntimeEngine, OgodRuntimeSceneDefault } from "@ogod/runtime-core";
import { Observable, of } from "rxjs";
import { filter, switchMap, take, tap, map } from 'rxjs/operators';
import { WORLD_RATIO } from '../../system/physics/runtime';
import { Box2dStatePhysics } from '../../system/physics/state';
import { Box2dStateDebug } from "./state";

declare var self: OgodRuntimeEngine;

export class Box2dRuntimeDebug extends OgodRuntimeSceneDefault {
    physics: Box2dStatePhysics;

    initialize(state: Box2dStateDebug, state$: Observable<OgodStateEngine>): Observable<OgodActionScene> {
        return state$.pipe(
            filter((fs) => fs.system[state.physicsId] && !!(fs.system[state.physicsId] as Box2dStatePhysics).world$),
            tap((fs) => {
                this.physics = fs.system[state.physicsId] as Box2dStatePhysics;
            }),
            take(1),
            switchMap(() => {
                if (state.draw && !state.context$) {
                    return state$.pipe(
                        filter((fs) => !!(fs.scene[state.id] as Box2dStateDebug).context$),
                        map((fs) => fs.scene[state.id]),
                        take(1)
                    );
                }
                return of(state);
            }),
            switchMap((initState) => super.initialize({
                ...initState,
                graphics: {}
            } as any, state$))
        );
    }

    nextCanvas(state: Box2dStateDebug, canvas: OffscreenCanvas, lastCanvas: OffscreenCanvas) {
        if (state.draw) {
            return {
                context$: canvas.getContext('2d')
            } as Box2dStateDebug;
        }
        return;
    }

    render(state: Box2dStateDebug) {
        if (state.draw && state.context$) {
            for (let graphic of Object.values(state.graphics)) {
                state.context$.fillStyle = 'rgba(255, 0, 0, 0.2)';
                state.context$.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                state.context$.beginPath();
                if (graphic.vertices) {
                    state.context$.moveTo(graphic.position.x + graphic.vertices[0].x * WORLD_RATIO, graphic.position.y + graphic.vertices[0].y * WORLD_RATIO);
                    for (let i = 1; i < graphic.vertices.length; i++) {
                        state.context$.lineTo(graphic.position.x + graphic.vertices[i].x * WORLD_RATIO, graphic.position.y + graphic.vertices[i].y * WORLD_RATIO);
                    }
                } else if (graphic.radius) {
                    state.context$.moveTo(graphic.position.x, graphic.position.y);
                    state.context$.arc(graphic.position.x, graphic.position.y, graphic.radius, graphic.angle, graphic.angle + Math.PI * 2);
                }
                state.context$.closePath();
                state.context$.stroke();
                state.context$.fill();
            }
        }
    }

    update(delta: number, state: Box2dStateDebug) {
        let body = this.physics.world$.GetBodyList();
        while (body != null) {
            let fx = body.GetFixtureList();
            while (fx != null) {
                const shape = fx.GetShape() as b2PolygonShape;
                const pos = body.GetPosition();
                state.graphics[body.GetUserData().id] = {
                    position: new b2Vec2(pos.x * WORLD_RATIO, pos.y * WORLD_RATIO),
                    vertices: shape.m_vertices,
                    angle: body.GetAngle()
                }
                if (!shape.m_vertices) {
                    state.graphics[body.GetUserData().id].radius = (shape as any as b2CircleShape).m_radius * WORLD_RATIO;
                }
                fx = fx.GetNext();
            }
            body = body.GetNext();
        }
    }
}
