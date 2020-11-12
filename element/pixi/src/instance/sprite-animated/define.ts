import { Hybrids } from 'hybrids';
import { ogodDefineInstance } from "@ogod/element-core";
import { pixiHybridInstance } from "../default/hybrid";
import { pixiHybridSprite } from "../sprite/hybrid";
import { pixiHybridSpriteAnimated } from "./hybrid";

export function pixiDefineSpriteAnimated(tagName?: string, stateHybrids: Array<Hybrids<any>> = [], overrideHybrids: Array<Hybrids<any>> = []) {
    return ogodDefineInstance(tagName || 'pixi-sprite-animated',
        [pixiHybridInstance(), pixiHybridSprite(), pixiHybridSpriteAnimated(), ...stateHybrids],
        [{ runtime: 'sprite-animated' }, ...overrideHybrids]
    );
}
