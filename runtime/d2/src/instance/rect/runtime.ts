import { OgodRuntimeInstanceDefault } from "@ogod/runtime-core";
import { D2StateRect } from "./state";

export const d2DrawRect = (context: OffscreenCanvasRenderingContext2D, state: D2StateRect) => {
    context.fillRect(state.x, state.y, state.sizeX, state.sizeY);
}

export class D2RuntimeRect extends OgodRuntimeInstanceDefault {

    render(context: OffscreenCanvasRenderingContext2D, state: D2StateRect) {
        context.fillStyle = state.color;
        if (state.angle) {
            context.save();
            context.translate(state.x + state.sizeX / 2, state.y + state.sizeY / 2);
            context.rotate(state.angle);
            context.translate(-state.x - state.sizeX / 2, -state.y - state.sizeY / 2);
        }
        d2DrawRect(context, state);
        if (state.angle) {
            context.restore();
        }
    }
}
