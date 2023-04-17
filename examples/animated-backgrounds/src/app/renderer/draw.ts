export type Shape = 'circle' | 'rect';
export const SHAPES: Shape[] = ['circle', 'rect'];

export function drawRect(ctx: CanvasRenderingContext2D) {
    return (obj) => {
        ctx.globalAlpha = obj.v;
        ctx.fillStyle = obj.c;
        ctx.fillRect(obj.x - obj.s / 2, obj.y - obj.s / 2, obj.s, obj.s);
    };
}

export function drawCircle(ctx: CanvasRenderingContext2D) {
    return (obj) => {
        ctx.globalAlpha = obj.v;
        ctx.fillStyle = obj.c;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.s / 2, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}
