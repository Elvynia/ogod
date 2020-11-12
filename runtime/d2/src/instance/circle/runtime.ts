import { OgodRuntimeInstanceDefault } from "@ogod/runtime-core";
import { D2StateCircle } from "./state";

export const d2DrawCircle = (context: OffscreenCanvasRenderingContext2D, state: D2StateCircle) => {
    context.beginPath();
    context.arc(state.x, state.y, state.size / 2, 0, 2 * Math.PI);
    context.fill();
}

export class D2RuntimeCircle extends OgodRuntimeInstanceDefault {

    render(context: OffscreenCanvasRenderingContext2D, state: D2StateCircle) {
        context.fillStyle = state.color;
        d2DrawCircle(context, state);
    }
}
