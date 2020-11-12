"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box2dRuntimeDebug = void 0;
const box2d_1 = require("@flyover/box2d");
const runtime_core_1 = require("@ogod/runtime-core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const runtime_1 = require("../../system/physics/runtime");
class Box2dRuntimeDebug extends runtime_core_1.OgodRuntimeSceneDefault {
    initialize(state, state$) {
        return state$.pipe(operators_1.filter((fs) => fs.system[state.physicsId] && !!fs.system[state.physicsId].world$), operators_1.tap((fs) => {
            this.physics = fs.system[state.physicsId];
        }), operators_1.take(1), operators_1.switchMap(() => {
            if (state.draw && !state.context$) {
                return state$.pipe(operators_1.filter((fs) => !!fs.scene[state.id].context$), operators_1.map((fs) => fs.scene[state.id]), operators_1.take(1));
            }
            return rxjs_1.of(state);
        }), operators_1.switchMap((initState) => super.initialize(Object.assign(Object.assign({}, initState), { graphics: {} }), state$)));
    }
    nextCanvas(state, canvas, lastCanvas) {
        if (state.draw) {
            return {
                context$: canvas.getContext('2d')
            };
        }
        return;
    }
    render(state) {
        if (state.draw && state.context$) {
            for (let graphic of Object.values(state.graphics)) {
                state.context$.fillStyle = 'rgba(255, 0, 0, 0.2)';
                state.context$.strokeStyle = 'rgba(255, 0, 0, 0.6)';
                state.context$.beginPath();
                if (graphic.vertices) {
                    state.context$.moveTo(graphic.position.x + graphic.vertices[0].x * runtime_1.WORLD_RATIO, graphic.position.y + graphic.vertices[0].y * runtime_1.WORLD_RATIO);
                    for (let i = 1; i < graphic.vertices.length; i++) {
                        state.context$.lineTo(graphic.position.x + graphic.vertices[i].x * runtime_1.WORLD_RATIO, graphic.position.y + graphic.vertices[i].y * runtime_1.WORLD_RATIO);
                    }
                }
                else if (graphic.radius) {
                    state.context$.moveTo(graphic.position.x, graphic.position.y);
                    state.context$.arc(graphic.position.x, graphic.position.y, graphic.radius, graphic.angle, graphic.angle + Math.PI * 2);
                }
                state.context$.closePath();
                state.context$.stroke();
                state.context$.fill();
            }
        }
    }
    update(delta, state) {
        let body = this.physics.world$.GetBodyList();
        while (body != null) {
            let fx = body.GetFixtureList();
            while (fx != null) {
                const shape = fx.GetShape();
                const pos = body.GetPosition();
                state.graphics[body.GetUserData().id] = {
                    position: new box2d_1.b2Vec2(pos.x * runtime_1.WORLD_RATIO, pos.y * runtime_1.WORLD_RATIO),
                    vertices: shape.m_vertices,
                    angle: body.GetAngle()
                };
                if (!shape.m_vertices) {
                    state.graphics[body.GetUserData().id].radius = shape.m_radius * runtime_1.WORLD_RATIO;
                }
                fx = fx.GetNext();
            }
            body = body.GetNext();
        }
    }
}
exports.Box2dRuntimeDebug = Box2dRuntimeDebug;
//# sourceMappingURL=runtime.js.map