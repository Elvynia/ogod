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
export declare const OgodPixiRegistry: {
    'scene.default': typeof PixiRuntimeScene;
    'instance.parallax': typeof PixiRuntimeParallax;
    'instance.sprite': typeof PixiRuntimeSprite;
    'instance.sprite-animated': typeof PixiRuntimeSpriteAnimated;
    'instance.sprite-tiled': typeof PixiRuntimeSpriteTiled;
    'instance.sprite-compass': typeof PixiRuntimeSpriteCompass;
    'resource.texture': typeof PixiRuntimeTexture;
    'resource.textures': typeof PixiRuntimeTextures;
    'resource.spritesheet': typeof PixiRuntimeSpritesheet;
    'system.world': typeof PixiRuntimeWorld;
    'system.world-side': typeof PixiRuntimeWorldSide;
    'system.velocity': typeof PixiRuntimeVelocity;
};
