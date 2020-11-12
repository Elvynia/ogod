import { Hybrids } from "hybrids";
import { D2ElementShape } from "./element";
import { ogodFactoryInstanceProperty } from "@ogod/element-core";

export function d2HybridShape(): Hybrids<D2ElementShape> {
    return {
        type: ogodFactoryInstanceProperty('circle')
    }
};
