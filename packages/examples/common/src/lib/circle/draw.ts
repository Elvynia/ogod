import { PI2 } from "../util";
import { Circle } from "./type";

export function makeDrawCircle(ctx: OffscreenCanvasRenderingContext2D) {
    return (circle: Circle) => {
        ctx.save();
        ctx.globalAlpha = circle.opacity;
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius / 2, 0, PI2, false);
        ctx.fill();
        ctx.restore();
    }
}
