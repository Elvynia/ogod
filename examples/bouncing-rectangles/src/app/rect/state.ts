import { b2Body } from "@box2d/core";

export interface Rect {
    angle: number;
    dynamic: boolean;
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string | CanvasGradient;
    body: b2Body;
    health: number;
    colorLight: boolean;
}
