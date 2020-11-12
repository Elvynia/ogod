import { D2RuntimeShape } from './instance/shape/runtime';
import { D2RuntimeScene } from './scene/default/runtime';
import { D2RuntimeTranslate } from './system/translate/runtime';
import { D2RuntimeCircle } from './instance/circle/runtime';
import { D2RuntimeRect } from './instance/rect/runtime';
import { D2RuntimeSquare } from './instance/square/runtime';
import { D2RuntimeRainbow } from './instance/rainbow/runtime';
export declare const OgodD2Registry: {
    'system.translate': typeof D2RuntimeTranslate;
    'scene.default': typeof D2RuntimeScene;
    'instance.default': typeof D2RuntimeShape;
    'instance.circle': typeof D2RuntimeCircle;
    'instance.rect': typeof D2RuntimeRect;
    'instance.square': typeof D2RuntimeSquare;
    'instance.rainbow': typeof D2RuntimeRainbow;
};
