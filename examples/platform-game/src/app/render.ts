import SvgPath from 'svg-path-to-canvas';
import { Camera } from './camera/state';
import { Shape } from "./shape/state";
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
    return (svg: string) => {
        const sp = new SvgPath(svg)
        const [cx, cy] = sp.center
        sp.save()
            .beginPath()
            .translate(-cx, -cy)
            .rotate(45)
            .scale(10)
            .translate(cx, cy)
            .translate(350, 350)
            .strokeStyle('red')
            .lineWidth(3)
            .to(ctx)
            .stroke();
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
            state.splash.logos.forEach((obj) => drawHandlers['svg'](obj));
        },
        play: (delta: number, state: AppState) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            Object.values(state.gmap.platforms).forEach((obj) => drawHandlers[obj.type](obj, state.camera));
            Object.values(state.shapes).forEach((obj) => drawHandlers[obj.type](obj, state.camera));
        }
    };
}
