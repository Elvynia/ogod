import { OgodElementEngine } from "../engine/element";

export interface OgodElementRouter extends HTMLElement {
    engine: OgodElementEngine;
    path: string;
    switch: any;
}
