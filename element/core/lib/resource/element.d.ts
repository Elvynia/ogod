import { OgodElementActor } from "../actor/element";
export interface OgodElementResource extends OgodElementActor<'resource'> {
    path: string;
}
export interface OgodElementResources extends OgodElementActor<'resource'> {
    paths: string;
}
