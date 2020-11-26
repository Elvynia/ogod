import { OgodCategoryState } from "@ogod/common";
import { OgodElementEngine } from '../engine/element';

export interface OgodElementActor<C extends string> extends HTMLElement {
    category: C;
    runtime: string;
    id: string;
    engine: OgodElementEngine;
}
