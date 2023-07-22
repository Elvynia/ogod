import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";

export type Cube = Mesh<BoxGeometry, MeshLambertMaterial> & { currentHex: number };

export type CubeState = Record<string, Cube>;
