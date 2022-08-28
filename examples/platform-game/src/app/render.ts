import { Camera } from './camera/state';
import { Shape } from "./shape/state";
import { AppState } from "./state";

const PI2 = 2 * Math.PI;

export function drawRect(ctx: CanvasRenderingContext2D) {
    return (shape: Shape, camera: Camera) => {
        ctx.save();
        ctx.translate(shape.x - camera.x, ctx.canvas.height - shape.y + camera.y);
        ctx.rotate(-shape.body.GetAngle());
        ctx.fillStyle = shape.color;
        ctx.fillRect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
        ctx.restore();
    };
}

export function drawCircle(ctx: CanvasRenderingContext2D) {
    return (obj: Shape, camera: Camera) => {
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(obj.x, ctx.canvas.height - obj.y, obj.width / 2, 0, PI2, false);
        ctx.fill();
    }
}

export const makeDrawHandlers = (ctx) => ({
    circle: drawCircle(ctx),
    rect: drawRect(ctx)
});

export function makeRender(canvas: any) {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const drawHandlers = makeDrawHandlers(ctx);
    return (delta: number, state: AppState) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (state.shapes) {
            Object.values(state.shapes).forEach((obj) => drawHandlers[obj.type](obj, state.camera));
        }
    };
}
