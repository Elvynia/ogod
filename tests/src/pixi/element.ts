import {
    ogodDefineEngine, ogodFactoryInstanceProperty, ogodFactoryInstanceChildren,
    ogodDefineKeys, ogodDefineKey, ogodFactoryInstanceBoolean, ogodFactorySceneProperty,
    ogodDefineArea, ogodDefineCamera
} from "@ogod/element-core";
import {
    pixiDefineScene, pixiDefineParallax, pixiDefineSprite, pixiDefineRenderer,
    pixiDefineSpriteAnimated, pixiDefineSpriteCompass, pixiDefineWorldSide,
    pixiDefineSpriteTiled, pixiDefineTexture, pixiDefineTextures, pixiDefineSpritesheet
} from "@ogod/element-pixi";
import { box2dDefinePhysics, box2dDefineBody, box2dDefineShapeBox, box2dDefineJump, box2dDefineDebug, box2dDefineVelocity } from "@ogod/element-box2d";

ogodDefineEngine();
ogodDefineKeys();
ogodDefineKey();
ogodDefineArea();
ogodDefineCamera();
pixiDefineRenderer();
pixiDefineScene();
pixiDefineParallax();
pixiDefineSprite();
pixiDefineSpriteAnimated(null, [{
    worldX: ogodFactoryInstanceProperty(0),
    worldY: ogodFactoryInstanceProperty(0),
    tx: ogodFactoryInstanceProperty(0),
    body: ogodFactoryInstanceChildren('body'),
    keys: ogodFactoryInstanceChildren('keys'),
    grounded: ogodFactoryInstanceBoolean(false),
    jumping: ogodFactoryInstanceBoolean(false),
    sensorY: ogodFactoryInstanceProperty(0),
    maxSpeed: ogodFactoryInstanceProperty(140),
}]);
pixiDefineSpriteCompass();
pixiDefineSpriteTiled();
pixiDefineTexture();
pixiDefineTextures();
pixiDefineSpritesheet();
pixiDefineWorldSide();
box2dDefinePhysics();
box2dDefineJump();
box2dDefineVelocity();
box2dDefineBody();
box2dDefineShapeBox();
box2dDefineDebug(null, [{
    worldId: ogodFactorySceneProperty('world')
}]);
