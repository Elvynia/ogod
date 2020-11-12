import { Hybrids } from 'hybrids';
import { ogodDefineInstance } from "@ogod/element-core";
import { pixiHybridInstance } from "../default/hybrid";
import { pixiHybridSprite } from "../sprite/hybrid";
import { pixiHybridSpriteAnimated } from "../sprite-animated/hybrid";
import { pixiHybridSpriteCompass } from "./hybrid";

export function pixiDefineSpriteCompass(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'pixi-sprite-compass',
        [pixiHybridInstance(), pixiHybridSprite(), pixiHybridSpriteAnimated(), pixiHybridSpriteCompass(), ...stateHybrids],
        [{ runtime: 'sprite-compass' }, ...overrideHybrids]
    );
}
