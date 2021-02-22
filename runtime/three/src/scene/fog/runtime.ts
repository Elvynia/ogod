import { Fog } from "three";
import { ThreeStateFog } from './state';

export function threeCreateFog(fog: ThreeStateFog): Fog {
    return new Fog(fog.color, fog.near, fog.far);
}
