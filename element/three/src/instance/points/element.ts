import { PointsMaterialParameters } from "three";

export interface ThreeElementPoints extends HTMLElement {
    params: PointsMaterialParameters;
    vertices: number[];
    resource: string;
}
