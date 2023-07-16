import { Shape } from "../shape/type";

export interface Circle extends Shape {
    radius: number;
    type: 'circle';
}
