import { OgodElementSystem } from "@ogod/element-core";

export interface D2ElementTranslate extends OgodElementSystem {
    step: number;
    borderMode: 'infinite' | 'bounce';
}