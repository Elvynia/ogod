import { D2StateInstance } from "../default/state";
export interface D2StateShape extends D2StateInstance {
    type: string;
    size?: number;
    sizeX?: number;
    sizeY?: number;
}
