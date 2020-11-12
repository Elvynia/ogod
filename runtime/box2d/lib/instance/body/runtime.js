"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixiCreateBody = void 0;
const box2d_1 = require("@flyover/box2d");
const state_1 = require("../shape-box/state");
const state_2 = require("../shape-circle/state");
function pixiCreateBody(world, body, id) {
    const bd = new box2d_1.b2BodyDef();
    bd.position.Set(body.x, body.y);
    if (body.dynamic) {
        bd.type = box2d_1.b2BodyType.b2_dynamicBody;
        bd.fixedRotation = body.fixedRotation || false;
    }
    const b = world.CreateBody(bd);
    let shape;
    if (state_1.isShapeBox(body.shape)) {
        const boxShape = new box2d_1.b2PolygonShape();
        boxShape.SetAsBox(body.shape.x, body.shape.y, {
            x: body.shape.centerX || 0,
            y: body.shape.centerY || 0
        }, body.shape.angle);
        shape = boxShape;
    }
    else if (state_2.isShapeCircle(body.shape)) {
        const circleShape = new box2d_1.b2CircleShape(body.shape.radius);
        circleShape.Set({ x: body.shape.x, y: body.shape.y });
        shape = circleShape;
    }
    else {
        const polyShape = new box2d_1.b2PolygonShape();
        polyShape.Set(body.shape.vertices);
        shape = polyShape;
    }
    const fd = new box2d_1.b2FixtureDef();
    fd.shape = shape;
    fd.density = body.density || 1;
    fd.friction = body.friction || fd.friction;
    fd.restitution = body.restitution || fd.restitution;
    b.CreateFixture(fd);
    b.SetUserData({
        id
    });
    return b;
}
exports.pixiCreateBody = pixiCreateBody;
//# sourceMappingURL=runtime.js.map