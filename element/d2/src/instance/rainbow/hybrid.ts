import { ogodFactoryInstanceProperty } from "@ogod/element-core";
import { Hybrids } from "hybrids";
import { D2ElementRainbow } from "./element";

export function d2HybridRainbow(): Hybrids<D2ElementRainbow> {
    return {
        colors: ogodFactoryInstanceProperty(['red', 'orange', 'yellow', 'green', 'blue', 'Indigo', 'violet']),
        step: ogodFactoryInstanceProperty(1 / 8),
        x: ogodFactoryInstanceProperty(150),
        y: ogodFactoryInstanceProperty(130),
        width: ogodFactoryInstanceProperty(300),
        height: ogodFactoryInstanceProperty(150),
        index: ogodFactoryInstanceProperty(0),
        time: ogodFactoryInstanceProperty(0),
        tx: ogodFactoryInstanceProperty(0)
    };
}
