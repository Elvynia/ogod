import { ThreeStateInstance } from './../default/state';

export enum ThreeImportType {
    NONE, OBJ_MTL, GLTF
}

export interface ThreeStateObject extends ThreeStateInstance {
    path: string;
    type: ThreeImportType;
}
