import { ogodFactorySystemProperty } from "@ogod/element-core";
import { Hybrids } from "hybrids";
import { D2ElementTranslate } from "./element";

export function d2HybridTranslate(): Hybrids<D2ElementTranslate> {
    return {
        step: ogodFactorySystemProperty(0.1),
        borderMode: ogodFactorySystemProperty('infinite')
    };
}
