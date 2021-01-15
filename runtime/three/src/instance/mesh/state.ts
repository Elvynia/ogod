import { ThreeStateInstance } from "../default/state";
import { ThreeStateGeometry } from "../geometry/state";
import { ThreeStateMaterial } from "../material/state";

export interface ThreeStateMesh extends ThreeStateInstance {
    material: ThreeStateMaterial;
    geometry: ThreeStateGeometry;
}
