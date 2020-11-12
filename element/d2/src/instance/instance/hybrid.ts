import { D2ElementInstance } from './element';
import { ogodFactoryInstanceProperty } from "@ogod/element-core";
import { Hybrids } from "hybrids";

export function d2HybridInstance(): Hybrids<D2ElementInstance> {
    return {
        x: ogodFactoryInstanceProperty(0),
        y: ogodFactoryInstanceProperty(0),
        color: ogodFactoryInstanceProperty('black'),
        tx: ogodFactoryInstanceProperty(0),
        ty: ogodFactoryInstanceProperty(0),
        angle: ogodFactoryInstanceProperty(0)
    }
};
