import { AppState } from './state';

export type Shape = 'circle' | 'rect';
export const shapes: Shape[] = ['circle', 'rect'];

export function drawRect(ctx: CanvasRenderingContext2D) {
    return (obj) => {
        ctx.globalAlpha = obj.v;
        ctx.fillStyle = obj.c;
        ctx.fillRect(obj.x, obj.y, obj.s, obj.s);
    };
}

export function drawCircle(ctx: CanvasRenderingContext2D) {
    return (obj) => {
        ctx.globalAlpha = obj.v;
        ctx.fillStyle = obj.c;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.s, 0, 2 * Math.PI, false);
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
        Object.values(state.objects).forEach((obj) => drawHandlers[obj.shape](obj));
    };
}
