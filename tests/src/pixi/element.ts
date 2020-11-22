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
import {
    box2dDefinePhysics, box2dDefineBody, box2dHybridInstanceBody, box2dDefineShapeBox, box2dHybridInstanceJump,
    box2dDefineJump, box2dDefineDebug, box2dDefineVelocity, box2dDefineFixture, box2dDefineSensor
} from "@ogod/element-box2d";

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
    ...box2dHybridInstanceJump(),
    ...box2dHybridInstanceBody(),
    worldX: ogodFactoryInstanceProperty(0),
    worldY: ogodFactoryInstanceProperty(0),
    tx: ogodFactoryInstanceProperty(0),
    keys: ogodFactoryInstanceChildren('keys'),
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
box2dDefineFixture();
box2dDefineShapeBox();
box2dDefineSensor();
box2dDefineDebug(null, [{
    worldId: ogodFactorySceneProperty('world')
}]);
