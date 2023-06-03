export interface Circle {
    color: string;
    id: number;
    x: number;
    y: number;
    radius: number;
}

export type SplashState = Record<string, Circle>;
