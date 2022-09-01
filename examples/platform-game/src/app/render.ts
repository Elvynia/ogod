import { Camera } from './camera/state';
import { Shape } from "./shape/state";
import { Sleet } from './sleet/state';
import { AppState } from './state';

const PI2 = 2 * Math.PI;

export function makeDrawRect(ctx: CanvasRenderingContext2D) {
    return (shape: Shape, camera: Camera) => {
        ctx.save();
        ctx.translate(shape.x - camera.x, ctx.canvas.height - shape.y + camera.y);
        ctx.rotate(-shape.body.GetAngle());
        ctx.fillStyle = shape.color;
        ctx.fillRect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
        ctx.restore();
    };
}

export function makeDrawCircle(ctx: CanvasRenderingContext2D) {
    return (obj: Shape) => {
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(obj.x, ctx.canvas.height - obj.y, obj.width / 2, 0, PI2, false);
        ctx.fill();
    }
}

export function makeDrawSvg(ctx: CanvasRenderingContext2D) {
    ctx.lineCap = 'round';
    return (sleet: Sleet) => {
        ctx.beginPath();
        ctx.lineWidth = sleet.width;
        ctx.strokeStyle = sleet.color;
        ctx.arc(sleet.x, sleet.y, sleet.radius, sleet.angleStart, sleet.angleStop);
        ctx.stroke();
    }
}

export const makeDrawHandlers = (ctx) => ({
    circle: makeDrawCircle(ctx),
    rect: makeDrawRect(ctx),
    svg: makeDrawSvg(ctx)
});

export function makeRender(canvas: any) {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const drawHandlers = makeDrawHandlers(ctx);
    return {
        splash: (delta: number, state: AppState) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            Object.values(state.splash).forEach((obj) => drawHandlers['svg'](obj));
        },
        play: (delta: number, state: AppState) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            Object.values(state.gmap.platforms).forEach((obj) => drawHandlers[obj.type](obj, state.camera));
            Object.values(state.shapes).forEach((obj) => drawHandlers[obj.type](obj, state.camera));
        }
    };
}
