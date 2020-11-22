import { Box2dElementShape } from "../shape/element";

export interface Box2dElementFixture extends HTMLElement {
    category: 'fixture';
    density?: number;
    friction?: number;
    restitution?: number;
    shape: Box2dElementShape;
}
