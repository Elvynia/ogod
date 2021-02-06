import { OgodRegistry } from '@ogod/runtime-core';
import { ThreeRuntimeControlFly } from './instance/control-fly/runtime';
import { ThreeRuntimeLightAmbient } from './instance/light-ambient/runtime';
import { ThreeRuntimeLightPoint } from './instance/light-point/runtime';
import { ThreeRuntimeLightSpot } from './instance/light-spot/runtime';
import { ThreeRuntimeMesh } from './instance/mesh/runtime';
import { ThreeRuntimePoints } from './instance/points/runtime';
import { ThreeRuntimeRenderer } from './renderer/default/runtime';
import { ThreeRuntimeTexture } from './resource/texture/runtime';
import { ThreeRuntimeScene } from './scene/default/runtime';

export const OgodThreeRegistry: OgodRegistry = {
    'scene.default': ThreeRuntimeScene,
    'renderer.default': ThreeRuntimeRenderer,
    'instance.mesh': ThreeRuntimeMesh,
    'instance.points': ThreeRuntimePoints,
    'instance.light-ambient': ThreeRuntimeLightAmbient,
    'instance.light-point': ThreeRuntimeLightPoint,
    'instance.light-spot': ThreeRuntimeLightSpot,
    'instance.control-fly': ThreeRuntimeControlFly,
    'resource.texture': ThreeRuntimeTexture
};
