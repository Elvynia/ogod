"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OgodPixiRegistry = void 0;
const runtime_1 = require("./scene/default/runtime");
const runtime_2 = require("./instance/parallax/runtime");
const runtime_3 = require("./instance/sprite/runtime");
const runtime_4 = require("./instance/sprite-animated/runtime");
const runtime_5 = require("./instance/sprite-tiled/runtime");
const runtime_6 = require("./instance/sprite-compass/runtime");
const runtime_7 = require("./resource/texture/runtime");
const runtime_8 = require("./resource/textures/runtime");
const runtime_9 = require("./resource/spritesheet/runtime");
const runtime_10 = require("./system/world/runtime");
const runtime_11 = require("./system/world-side/runtime");
const runtime_12 = require("./system/velocity/runtime");
exports.OgodPixiRegistry = {
    'scene.default': runtime_1.PixiRuntimeScene,
    'instance.parallax': runtime_2.PixiRuntimeParallax,
    'instance.sprite': runtime_3.PixiRuntimeSprite,
    'instance.sprite-animated': runtime_4.PixiRuntimeSpriteAnimated,
    'instance.sprite-tiled': runtime_5.PixiRuntimeSpriteTiled,
    'instance.sprite-compass': runtime_6.PixiRuntimeSpriteCompass,
    'resource.texture': runtime_7.PixiRuntimeTexture,
    'resource.textures': runtime_8.PixiRuntimeTextures,
    'resource.spritesheet': runtime_9.PixiRuntimeSpritesheet,
    'system.world': runtime_10.PixiRuntimeWorld,
    'system.world-side': runtime_11.PixiRuntimeWorldSide,
    'system.velocity': runtime_12.PixiRuntimeVelocity
};
//# sourceMappingURL=registry.js.map