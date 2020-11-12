import { PixiRuntimeScene } from "./scene/default/runtime";
import { PixiRuntimeParallax } from "./instance/parallax/runtime";
import { PixiRuntimeSprite } from "./instance/sprite/runtime";
import { PixiRuntimeSpriteAnimated } from "./instance/sprite-animated/runtime";
import { PixiRuntimeSpriteTiled } from "./instance/sprite-tiled/runtime";
import { PixiRuntimeSpriteCompass } from "./instance/sprite-compass/runtime";
import { PixiRuntimeTexture } from "./resource/texture/runtime";
import { PixiRuntimeTextures } from "./resource/textures/runtime";
import { PixiRuntimeSpritesheet } from "./resource/spritesheet/runtime";
import { PixiRuntimeWorld } from "./system/world/runtime";
import { PixiRuntimeWorldSide } from "./system/world-side/runtime";
import { PixiRuntimeVelocity } from "./system/velocity/runtime";

export const OgodPixiRegistry = {
    'scene.default': PixiRuntimeScene,
    'instance.parallax': PixiRuntimeParallax,
    'instance.sprite': PixiRuntimeSprite,
    'instance.sprite-animated': PixiRuntimeSpriteAnimated,
    'instance.sprite-tiled': PixiRuntimeSpriteTiled,
    'instance.sprite-compass': PixiRuntimeSpriteCompass,
    'resource.texture': PixiRuntimeTexture,
    'resource.textures': PixiRuntimeTextures,
    'resource.spritesheet': PixiRuntimeSpritesheet,
    'system.world': PixiRuntimeWorld,
    'system.world-side': PixiRuntimeWorldSide,
    'system.velocity': PixiRuntimeVelocity
};
