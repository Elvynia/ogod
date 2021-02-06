import { ThreeElementGeometry } from './../geometry/element';
import { ThreeElementMaterial } from './../material/element';

export interface ThreeElementMesh extends HTMLElement {
    material: ThreeElementMaterial;
    geometry: ThreeElementGeometry;
    resource: string;
}
