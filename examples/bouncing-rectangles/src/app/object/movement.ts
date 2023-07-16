import { Box } from "./state";

export const updateMovement = (obj: Box, scale: number, canvas: OffscreenCanvas) => {
    const pos = obj.body.GetPosition();
    const newPos = pos.Clone();
    const appWidth = canvas.width / scale;
    const appHeight = canvas.height / scale;
    if (pos.x < 0) {
        newPos.Set(pos.x + appWidth, appHeight - pos.y);
    } else if (pos.x > appWidth) {
        newPos.Set(pos.x - appWidth, appHeight - pos.y);
    }
    if (pos.y < 0) {
        newPos.Set(appWidth - newPos.x, pos.y + appHeight);
    } else if (pos.y > appHeight) {
        newPos.Set(appWidth - newPos.x, pos.y - appHeight);
    }
    if (pos.x !== newPos.x || pos.y !== newPos.y) {
        obj.body.SetTransformVec(newPos, 0);
    }
    obj.x = Math.round(obj.body.GetPosition().x * scale);
    obj.y = Math.round(obj.body.GetPosition().y * scale);
    obj.angle = -obj.body.GetAngle();
};
