"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isShapeBox = void 0;
function isShapeBox(shape) {
    return shape.x != null && shape.y != null && shape.radius == null;
}
exports.isShapeBox = isShapeBox;
//# sourceMappingURL=state.js.map