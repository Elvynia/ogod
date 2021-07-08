import { ThreeStateInstance } from './../instance/default/state';
import { OgodStateGroup } from "@ogod/common";
import { Group } from "three";

export interface ThreeStateGroup extends OgodStateGroup, ThreeStateInstance {
    object$: Group;
}
