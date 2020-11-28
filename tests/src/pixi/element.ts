import {
    box2dDefineBody,
    box2dDefineDebug, box2dDefineFixture, box2dDefinePhysics,
    box2dDefineSensor, box2dDefineShapeBox,
    box2dDefineVelocity, box2dHybridInstanceBody
} from "@ogod/element-box2d";
import {
    ogodDefineArea, ogodDefineCamera, ogodDefineKey, ogodDefineKeys,
    ogodDefineRouter, ogodFactoryInstanceChildren, ogodFactoryInstanceProperty,
    ogodFactorySceneProperty
} from "@ogod/element-core";
import {
    pixiDefineEngine, pixiDefineParallax, pixiDefineRenderer, pixiDefineScene, pixiDefineSprite,
    pixiDefineSpriteAnimated, pixiDefineSpriteCompass,
    pixiDefineSpritesheet, pixiDefineSpriteTiled, pixiDefineTexture, pixiDefineTextures, pixiDefineWorldSide
} from "@ogod/element-pixi";
import { dispatch } from "hybrids";
import { demoDefineDummy } from "./dummy";
import { demoDefineMenu } from "./menu/define";

ogodDefineKeys();
ogodDefineKey();
ogodDefineArea();
ogodDefineCamera();
ogodDefineRouter(null, [{
    init: {
        connect: (host) => {
            host.switch = {
                next: (...args) => {
                    console.log(args)
                }
            }
            dispatch(host, 'ogod-router', { bubbles: true });
        }
    } 
}]);
pixiDefineEngine();
pixiDefineRenderer();
pixiDefineScene();
pixiDefineParallax();
pixiDefineSprite();
pixiDefineSpriteAnimated();
pixiDefineSpriteAnimated('pixi-hero', [{
    ...box2dHybridInstanceBody(),
    worldX: ogodFactoryInstanceProperty(0),
    worldY: ogodFactoryInstanceProperty(0),
    tx: ogodFactoryInstanceProperty(0),
    keys: ogodFactoryInstanceChildren('keys'),
    maxSpeed: ogodFactoryInstanceProperty(140),
}], [{ runtime: 'hero' }]);
pixiDefineSpriteCompass();
pixiDefineSpriteTiled();
pixiDefineTexture();
pixiDefineTextures();
pixiDefineSpritesheet();
pixiDefineWorldSide();
box2dDefinePhysics();
box2dDefineVelocity();
box2dDefineBody();
box2dDefineFixture();
box2dDefineShapeBox();
box2dDefineSensor();
box2dDefineDebug(null, [{
    worldId: ogodFactorySceneProperty('world')
}]);
demoDefineMenu();
demoDefineDummy();
