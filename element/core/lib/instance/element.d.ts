import { OgodElementScene } from './../scene/element';
import { OgodElementReactive } from '../reactive/element';
export interface OgodElementInstance extends OgodElementReactive<'instance'> {
    scene: OgodElementScene;
    scenes: string;
}
