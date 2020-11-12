import { Box2dElementShape } from "../shape/element";
export interface Box2dElementBody extends HTMLElement {
    category: 'body';
    x: number;
    y: number;
    dynamic: boolean;
    density?: number;
    friction?: number;
    restitution?: number;
    shape: Box2dElementShape;
}
