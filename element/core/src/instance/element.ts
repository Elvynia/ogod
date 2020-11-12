import { OgodElementScene } from './../scene/element';
import { OgodStateScene } from "@ogod/common";
import { OgodElementReactive } from '../reactive/element';

export interface OgodElementInstance extends OgodElementReactive<'instance'> {
    scene: OgodElementScene;
    scenes: string;
}
