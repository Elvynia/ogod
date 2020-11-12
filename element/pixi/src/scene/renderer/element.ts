export interface PixiElementRenderer extends HTMLElement {
    category: string;
    transparent: boolean;
    width: number;
    height: number;
    autoDensity: boolean;
    antialias: boolean;
    resolution: number;
    clearBeforeRender: boolean;
    preserveDrawingBuffer: boolean;
    backgroundColor: number;
    powerPreference: number;
}
