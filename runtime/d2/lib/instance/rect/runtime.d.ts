import { OgodRuntimeInstanceDefault } from "@ogod/runtime-core";
import { D2StateRect } from "./state";
export declare const d2DrawRect: (context: OffscreenCanvasRenderingContext2D, state: D2StateRect) => void;
export declare class D2RuntimeRect extends OgodRuntimeInstanceDefault {
    render(context: OffscreenCanvasRenderingContext2D, state: D2StateRect): void;
}
