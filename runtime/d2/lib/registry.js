"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OgodD2Registry = void 0;
const runtime_1 = require("./instance/shape/runtime");
const runtime_2 = require("./scene/default/runtime");
const runtime_3 = require("./system/translate/runtime");
const runtime_4 = require("./instance/circle/runtime");
const runtime_5 = require("./instance/rect/runtime");
const runtime_6 = require("./instance/square/runtime");
const runtime_7 = require("./instance/rainbow/runtime");
exports.OgodD2Registry = {
    'system.translate': runtime_3.D2RuntimeTranslate,
    'scene.default': runtime_2.D2RuntimeScene,
    'instance.default': runtime_1.D2RuntimeShape,
    'instance.circle': runtime_4.D2RuntimeCircle,
    'instance.rect': runtime_5.D2RuntimeRect,
    'instance.square': runtime_6.D2RuntimeSquare,
    'instance.rainbow': runtime_7.D2RuntimeRainbow
};
//# sourceMappingURL=registry.js.map