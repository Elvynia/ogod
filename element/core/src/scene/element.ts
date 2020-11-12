import { OgodStateScene } from "@ogod/common";
import { OgodElementReactive } from "../reactive/element";

export interface OgodElementScene extends OgodElementReactive<'scene'> {
    template: boolean;
}
