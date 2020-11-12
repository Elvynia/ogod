export interface PixiStateRenderer {
    width: number;
    height: number;
    transparent?: boolean;
    autoDensity?: boolean;
    antialias?: boolean;
    resolution?: number;
    clearBeforeRender?: boolean;
    preserveDrawingBuffer?: boolean;
    backgroundColor?: number;
    powerPreference?: string;
}
