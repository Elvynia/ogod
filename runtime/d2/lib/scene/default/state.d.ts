import { OgodStateScene } from "@ogod/common";
export interface D2StateScene extends OgodStateScene {
    context$: OffscreenCanvasRenderingContext2D;
    bgColor: string;
    clear: boolean;
}
