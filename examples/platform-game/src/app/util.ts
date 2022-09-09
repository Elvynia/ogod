export function randNum(length: number = 4): number {
    return Math.floor(Math.random() * Math.pow(10, length));
}

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export type BackgroundGradient = Position & Size & { color: CanvasGradient };
