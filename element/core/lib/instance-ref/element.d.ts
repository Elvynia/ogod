import { OgodElementScene } from "../scene/element";
export interface OgodElementInstanceRef extends HTMLElement {
    scene: OgodElementScene;
    target: string;
    active: boolean;
}
