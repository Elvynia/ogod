import { OgodStateSystem } from "@ogod/common";

export interface D2StateTranslate extends OgodStateSystem {
    step: number;
    borderMode: 'infinite' | 'bounce';
}
