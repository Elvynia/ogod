import { OgodStateSystem } from "@ogod/common";
import { OgodElementReactive } from "../reactive/element";

export interface OgodElementSystem extends OgodElementReactive<'system'> {
    aspects: string[];
    mode: 'any' | 'all';
}
