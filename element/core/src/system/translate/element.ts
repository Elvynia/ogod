import { OgodElementSystem } from "../element";

export interface OgodElementTranslate extends OgodElementSystem {
    scale: number;
    width: number;
    height: number;
    borderMode: 'infinite' | 'bounce';
}
