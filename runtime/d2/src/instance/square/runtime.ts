import { OgodRuntimeInstanceDefault } from "@ogod/runtime-core";
import { D2StateSquare } from "./state";

export const d2DrawSquare = (context: OffscreenCanvasRenderingContext2D, state: D2StateSquare) => {
    context.fillRect(state.x - state.size / 2, state.y - state.size / 2, state.size, state.size);
}

export class D2RuntimeSquare extends OgodRuntimeInstanceDefault {

    render(context: OffscreenCanvasRenderingContext2D, state: D2StateSquare) {
        context.fillStyle = state.color;
        if (state.angle) {
            context.save();
            context.rotate(state.angle);
        }
        d2DrawSquare(context, state);
        if (state.angle) {
            context.restore();
        }
    }
}
