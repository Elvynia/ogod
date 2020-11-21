import { D2RuntimeShape } from './instance/shape/runtime';
import { D2RuntimeScene } from './scene/default/runtime';
import { D2RuntimeCircle } from './instance/circle/runtime';
import { D2RuntimeRect } from './instance/rect/runtime';
import { D2RuntimeSquare } from './instance/square/runtime';
import { D2RuntimeRainbow } from './instance/rainbow/runtime';
import { OgodRegistry } from '@ogod/runtime-core';

export const OgodD2Registry: OgodRegistry = {
    'scene.default': D2RuntimeScene,
    'instance.default': D2RuntimeShape,
    'instance.circle': D2RuntimeCircle,
    'instance.rect': D2RuntimeRect,
    'instance.square': D2RuntimeSquare,
    'instance.rainbow': D2RuntimeRainbow
};
