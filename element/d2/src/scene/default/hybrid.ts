import { ogodFactorySceneProperty, OgodElementScene } from "@ogod/element-core";
import { Hybrids } from "hybrids";
import { D2ElementScene } from "./element";

export function d2HybridScene(): Hybrids<D2ElementScene> {
    return {
        bgColor: ogodFactorySceneProperty('#8FD5A6'),
        clear: ogodFactorySceneProperty(false)
    };
}
