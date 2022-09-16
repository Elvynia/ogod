export interface BackgroundGradient {
    color: CanvasGradient;
    x: number;
    y: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
}

export interface Background {
    baseColor: string;
    colors?: string[];
    lastPos?: number;
    gradients: Array<BackgroundGradient>;
}
