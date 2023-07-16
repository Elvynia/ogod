import { Shape } from "../shape/type";
import { Sizeable } from "../sizeable.type";

export interface Rect extends Sizeable, Shape {
    angle: number;
    type: 'rect';
}
