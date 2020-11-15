import { OgodStateResource } from "@ogod/common";
import { OgodElementActor } from "../actor/element";

export interface OgodElementResource extends OgodElementActor<'resource'> {
    path: string;
}

export interface OgodElementResources extends OgodElementActor<'resource'> {
    pathPrefix?: string;
    pathSuffix?: string;
    pathStart: number;
    pathCount: number;
    paths: string[];
}
