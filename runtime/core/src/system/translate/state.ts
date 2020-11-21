import { OgodStateSystem } from "@ogod/common";

export interface OgodStateTranslate extends OgodStateSystem {
    scale: number;
    width: number;
    height: number;
    modifier: string;
    modifierX: string;
    modifierY: string;
    borderMode: 'infinite' | 'bounce';
}
