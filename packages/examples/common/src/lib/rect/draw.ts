import { Rect } from "./type";

export function makeDrawRect(ctx: OffscreenCanvasRenderingContext2D) {
    return (rect: Rect) => {
        ctx.save();
        ctx.globalAlpha = rect.opacity;
        ctx.translate(rect.x, rect.y);
        ctx.rotate(rect.angle);
        ctx.fillStyle = rect.color;
        ctx.fillRect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
        ctx.restore();
    };
}
