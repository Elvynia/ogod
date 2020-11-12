import { ogodDefineEngine, ogodFactoryInstanceProperty, ogodFactoryInstanceChildren, ogodDefineKeys, ogodDefineKey, ogodFactoryInstanceBoolean, ogodFactorySceneProperty } from "@ogod/element-core";
import {
    pixiDefineScene, pixiDefineArea, pixiDefineCamera, pixiDefineParallax, pixiDefineSprite,
    pixiDefineSpriteAnimated, pixiDefineSpriteCompass, pixiDefineWorldSide, pixiDefineVelocity,
    pixiDefineSpriteTiled, pixiDefineTexture, pixiDefineTextures, pixiDefineSpritesheet, pixiDefineRenderer
} from "@ogod/element-pixi";
import { box2dDefinePhysics, box2dDefineBody, box2dDefineShapeBox, box2dDefineJump, box2dDefineDebug } from "@ogod/element-box2d";

ogodDefineEngine();
ogodDefineKeys();
ogodDefineKey();
pixiDefineRenderer();
pixiDefineScene();
pixiDefineArea();
pixiDefineCamera();
pixiDefineParallax();
pixiDefineSprite();
pixiDefineSpriteAnimated(null, [{
    worldX: ogodFactoryInstanceProperty(0),
    worldY: ogodFactoryInstanceProperty(0),
    velocity: ogodFactoryInstanceProperty(0),
    body: ogodFactoryInstanceChildren('body'),
    keys: ogodFactoryInstanceChildren('keys'),
    grounded: ogodFactoryInstanceBoolean(false),
    jumping: ogodFactoryInstanceBoolean(false),
    sensorY: ogodFactoryInstanceProperty(0)
}]);
pixiDefineSpriteCompass();
pixiDefineSpriteTiled();
pixiDefineTexture();
pixiDefineTextures();
pixiDefineSpritesheet();
pixiDefineWorldSide();
pixiDefineVelocity();
box2dDefinePhysics();
box2dDefineJump();
box2dDefineBody();
box2dDefineShapeBox();
box2dDefineDebug(null, [{
    worldId: ogodFactorySceneProperty('world')
}]);
