import { ogodFactoryInstanceProperty } from "@ogod/element-core";
import { ThreeImportType } from "@ogod/runtime-three";

export function threeHybridObject() {
    return {
        path: ogodFactoryInstanceProperty(''),
        type: ogodFactoryInstanceProperty(ThreeImportType.NONE)
    }
}
