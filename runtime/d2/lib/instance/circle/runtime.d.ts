import { OgodRuntimeInstanceDefault } from "@ogod/runtime-core";
import { D2StateCircle } from "./state";
export declare const d2DrawCircle: (context: OffscreenCanvasRenderingContext2D, state: D2StateCircle) => void;
export declare class D2RuntimeCircle extends OgodRuntimeInstanceDefault {
    render(context: OffscreenCanvasRenderingContext2D, state: D2StateCircle): void;
}
