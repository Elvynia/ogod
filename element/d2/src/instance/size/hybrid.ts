import { D2ElementSize, D2ElementSizeXY } from './element';
import { Hybrids } from "hybrids";
import { ogodFactoryInstanceProperty } from "@ogod/element-core";

export function d2HybridSize(): Hybrids<D2ElementSize> {
    return {
        size: ogodFactoryInstanceProperty(10)
    };
}

export function d2HybridSizeXY(): Hybrids<D2ElementSizeXY> {
    return {
        sizeX: ogodFactoryInstanceProperty(10),
        sizeY: ogodFactoryInstanceProperty(30)
    };
}
