import { b2Body, b2CircleShape, b2Fixture, b2PolygonShape, b2Vec2 } from '@flyover/box2d';
import { OgodActionScene, OgodStateEngine } from "@ogod/common";
import { OgodRuntimeEngine, OgodRuntimeSceneDefault } from "@ogod/runtime-core";
import { Observable, of } from "rxjs";
import { filter, map, switchMap, take } from 'rxjs/operators';
import { WORLD_RATIO } from '../../system/physics/runtime';
import { Box2dStatePhysics } from '../../system/physics/state';
import { Box2dStateDebug } from "./state";

declare var self: OgodRuntimeEngine;

export class Box2dRuntimeDebug extends OgodRuntimeSceneDefault {

    initialize(state: Box2dStateDebug, state$: Observable<OgodStateEngine>): Observable<OgodActionScene> {
        return state$.pipe(
            filter((fs) => fs.system[state.physicsId] && !!(fs.system[state.physicsId] as Box2dStatePhysics).world$),
            map((fs) => (fs.system[state.physicsId] as Box2dStatePhysics).world$),
            take(1),
            switchMap((world) => {
                if (state.draw && !(self.store.getState() as any).context$) {
                    return state$.pipe(
                        filter((fs: any) => !!fs.context$),
                        map((fs) => ({
                            ...fs.scene[state.id],
                            world$: world
                        })),
                        take(1)
                    );
                }
                return of({
                    ...state,
                    world$: world
                });
            }),
            switchMap((initState) => super.initialize({
                ...initState,
                graphics: {}
            } as any, state$))
        );
    }

    render(state: Box2dStateDebug) {
        const context = (self.store.getState() as any).context$;
        if (state.draw && context) {
            for (let graphic of Object.values(state.graphics)) {
                context.fillStyle = 'rgba(255, 0, 0, 0.2)';
                context.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                context.beginPath();
                if (graphic.vertices) {
                    context.moveTo(graphic.position.x + graphic.vertices[0].x * WORLD_RATIO, graphic.position.y + graphic.vertices[0].y * WORLD_RATIO);
                    for (let i = 1; i < graphic.vertices.length; i++) {
                        context.lineTo(graphic.position.x + graphic.vertices[i].x * WORLD_RATIO, graphic.position.y + graphic.vertices[i].y * WORLD_RATIO);
                    }
                } else if (graphic.radius) {
                    context.moveTo(graphic.position.x, graphic.position.y);
                    context.arc(graphic.position.x, graphic.position.y, graphic.radius, graphic.angle, graphic.angle + Math.PI * 2);
                }
                context.closePath();
                context.stroke();
                context.fill();
            }
        }
    }

    update(delta: number, state: Box2dStateDebug) {
        let body = state.world$.GetBodyList();
        while (body != null) {
            let fx = body.GetFixtureList();
            while (fx != null) {
                this.addGraphic(state, body, fx);
                fx = fx.GetNext();
            }
            body = body.GetNext();
        }
    }

    protected addGraphic(state: Box2dStateDebug, body: b2Body, fx: b2Fixture) {
        const shape = fx.GetShape() as b2PolygonShape;
        const pos = body.GetPosition();
        const id = (fx.GetUserData() ? fx.GetUserData().id + (fx.GetUserData().footSensor ? '_footSensor' : '') : body.GetUserData().id);
        state.graphics[id] = {
            position: new b2Vec2(pos.x * WORLD_RATIO, pos.y * WORLD_RATIO),
            vertices: shape.m_vertices,
            angle: body.GetAngle()
        };
        if (!shape.m_vertices) {
            state.graphics[id].radius = (shape as any as b2CircleShape).m_radius * WORLD_RATIO;
        }
    }
}
