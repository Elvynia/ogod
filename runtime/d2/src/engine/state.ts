import { OgodStateEngine } from "@ogod/common";

export interface D2StateEngine extends OgodStateEngine {
    context$: OffscreenCanvasRenderingContext2D;
}
