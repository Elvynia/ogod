import { OgodRuntimeInstanceDefault } from "@ogod/runtime-core";
import { D2StateSquare } from "./state";
export declare const d2DrawSquare: (context: OffscreenCanvasRenderingContext2D, state: D2StateSquare) => void;
export declare class D2RuntimeSquare extends OgodRuntimeInstanceDefault {
    render(context: OffscreenCanvasRenderingContext2D, state: D2StateSquare): void;
}
