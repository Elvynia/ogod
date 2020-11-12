import { OgodRuntimeInstanceDefault } from "@ogod/runtime-core";
import { d2DrawCircle } from "../circle/runtime";
import { d2DrawRect } from "../rect/runtime";
import { d2DrawSquare } from "../square/runtime";
import { D2StateShape } from "./state";

export class D2RuntimeShape extends OgodRuntimeInstanceDefault {

    render(context: OffscreenCanvasRenderingContext2D, state: D2StateShape) {
        context.fillStyle = state.color;
        if (state.angle) {
            context.save();
            context.rotate(state.angle);
        }
        switch (state.type) {
            case 'rect':
                d2DrawRect(context, state as any);
                break;
            case 'square':
                d2DrawSquare(context, state as any);
                break;
            case 'circle':
                d2DrawCircle(context, state as any);
                break;
        }
        if (state.angle) {
            context.restore();
        }
    }
}
