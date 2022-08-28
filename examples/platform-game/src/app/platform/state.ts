import { Shape } from "../shape/state";

export interface Platform extends Shape {
    type: 'rect';
}

export interface PlatformState {
    [key: string]: Platform;
}