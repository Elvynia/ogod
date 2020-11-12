import { engineInit, sceneInit, OGOD_CATEGORY, resourceInit, instanceInit, engineCanvas, engineStart, systemInit, instanceChanges } from '@ogod/common';
import { COMPASS } from '@ogod/runtime-pixi';
import { range } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { configurePlayer } from './player';

const canvas = (document.getElementById('test-canvas') as HTMLCanvasElement).transferControlToOffscreen();
const ww = new Worker('./pixiWorker.js', { type: 'module' });
// Initialize worker engine.
ww.postMessage(engineInit({
    id: 'test-engine'
}));
// Add a scene.
ww.postMessage(sceneInit({
    id: 'test-scene',
    state: {
        id: 'test-scene',
        category: OGOD_CATEGORY.SCENE,
        runtime: 'default',
        active: true,
        tick: false,
        updates: [],
        reflects: [],
        renderer: {
            transparent: true,
            width: canvas.width,
            height: canvas.height
        }
    } as any
}));
// Add a texture.
ww.postMessage(resourceInit({
    id: 'linktexture',
    state: {
        id: 'linktexture',
        category: OGOD_CATEGORY.RESOURCE,
        runtime: 'texture',
        path: '/assets/link.png',
        loading: false,
        loaded: false
    }
}));
// Add a sprite.
ww.postMessage(instanceInit({
    id: 'linksprite',
    state: {
        id: 'linksprite',
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'sprite',
        active: true,
        tick: false,
        updates: [],
        reflects: [],
        scenes: ['test-scene'],
        resource: 'linktexture',
        worldX: 100,
        worldY: 100,
        anchor: 0.5,
        scale: 0.2,
        rotation: 0,
        index: 2,
        body: {
            x: 10,
            y: 10,
            shape: {
                vertices: [{
                    x: -2,
                    y: -2
                }, {
                    x: 2,
                    y: -2
                }, {
                    x: 2,
                    y: 2
                }, {
                    x: -2,
                    y: 2
                }]
            }
        }
    } as any
}));
// Add a texture.
ww.postMessage(resourceInit({
    id: 'slimesheet',
    state: {
        id: 'slimesheet',
        category: OGOD_CATEGORY.RESOURCE,
        runtime: 'spritesheet',
        path: '/assets/slimes.json',
        loading: false,
        loaded: false
    }
}));
// Add an animated sprite.
ww.postMessage(instanceInit({
    id: 'slime',
    state: {
        id: 'slime',
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'sprite-animated',
        active: true,
        tick: true,
        updates: [],
        reflects: [],
        scenes: ['test-scene'],
        resource: 'slimesheet',
        animation: 'queen/0',
        durations: [750, 750, 750],
        playing: true,
        loop: true,
        x: 32,
        y: 32,
        anchor: 1,
        scale: 1,
        rotation: 0,
        index: 3
    } as any
}));
// Add a compass sprite.
ww.postMessage(instanceInit({
    id: 'slime2',
    state: {
        id: 'slime2',
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'sprite-compass',
        active: true,
        tick: true,
        updates: ['compass', 'animationBase', 'x', 'y'],
        reflects: [],
        scenes: ['test-scene'],
        resource: 'slimesheet',
        animationBase: 'metal',
        compass: COMPASS.N,
        duration: 750,
        loop: true,
        playing: true,
        body: {
            dynamic: true,
            x: 20,
            y: 10,
            shape: {
                x: 1.2,
                y: 1.2,
            }
        },
        worldX: 200,
        worldY: 100,
        velocity: 0,
        anchor: 0.5,
        scale: 1,
        rotation: 0,
        index: 3
    } as any
}));
// Add a texture array.
range(1, 3).pipe(
    map((i) => `/assets/bg/day_${i}.png`),
    toArray()
).subscribe((paths) => ww.postMessage(resourceInit({
    id: 'bgimages',
    state: {
        id: 'bgimages',
        category: OGOD_CATEGORY.RESOURCE,
        runtime: 'textures',
        paths
    } as any
})));
// Add a parallax sprite.
ww.postMessage(instanceInit({
    id: 'bg',
    state: {
        id: 'bg',
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'parallax',
        active: true,
        tick: true,
        updates: [],
        reflects: [],
        scenes: ['test-scene'],
        resource: 'bgimages',
        width: 1200,
        height: 408,
        x: 40,
        y: 40,
        scaleX: 1,
        scaleY: 1.15,
        rotation: 0,
        index: 0,
        speedFactor: 3,
        ratio: 1
    } as any
}));
// Add a repeatable ground texture.
ww.postMessage(resourceInit({
    id: 'groundsprite',
    state: {
        id: 'groundsprite',
        category: OGOD_CATEGORY.RESOURCE,
        runtime: 'texture',
        path: '/assets/ground.png'
    } as any
}));
// Add a tiling sprite.
ww.postMessage(instanceInit({
    id: 'ground',
    state: {
        id: 'ground',
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'sprite-tiled',
        active: true,
        tick: true,
        updates: [],
        reflects: [],
        scenes: ['test-scene'],
        resource: 'groundsprite',
        worldX: 720,
        worldY: 119,
        width: 640,
        height: 38,
        anchor: 0.5,
        body: {
            x: 72,
            y: 11.6,
            shape: {
                x: 32,
                y: 1.6
            }
        },
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        index: 1,
        ratio: 1
    } as any
}));
// Add hero sprites.
ww.postMessage(resourceInit({
    id: 'finnsprites',
    state: {
        id: 'finnsprites',
        category: OGOD_CATEGORY.RESOURCE,
        runtime: 'spritesheet',
        path: '/assets/finn.json'
    } as any
}));
// Add a tiling sprite.
ww.postMessage(instanceInit({
    id: 'finn',
    state: {
        id: 'finn',
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'sprite-animated',
        active: true,
        tick: true,
        updates: ['x', 'y', 'velocity', 'grounded', 'scaleX'],
        reflects: [],
        scenes: ['test-scene'],
        resource: 'finnsprites',
        jumping: false,
        grounded: false,
        playing: true,
        loop: true,
        animation: 'stand',
        duration: 1200,
        anchor: 0.5,
        body: {
            dynamic: true,
            x: 3.2,
            y: 36,
            density: 5,
            shape: {
                x: 1.7,
                y: 1.7
            }
        },
        sensorY: -2,
        // worldX: 32,
        // worldY: 360,
        worldX: 32,
        worldY: 32,
        velocity: 0,
        scaleX: 2,
        scaleY: 2,
        rotation: 0,
        index: 4
    } as any
}));

ww.postMessage(systemInit({
    id: 'world',
    state: {
        id: 'world',
        category: OGOD_CATEGORY.SYSTEM,
        runtime: 'world-side',
        active: true,
        tick: true,
        updates: [],
        reflects: [],
        aspects: ['worldX', 'worldY'],
        mode: 'all',
        backgrounds: ['bg'],
        follow: 'finn',
        bounds: {
            minX: 0,
            minY: -368,
            maxX: 3000,
            maxY: 368
        },
        camera: {
            x: 40,
            y: 40,
            worldX: 0,
            worldY: 0,
            width: 1200,
            height: 444,
            offset: {
                minX: 500,
                minY: 0,
                maxX: 700,
                maxY: 100
            }
        },
        inbounds: false
    } as any
}));
ww.postMessage(systemInit({
    id: 'velocity',
    state: {
        id: 'velocity',
        category: OGOD_CATEGORY.SYSTEM,
        runtime: 'velocity',
        active: true,
        tick: true,
        updates: [],
        reflects: [],
        aspects: ['velocity', 'body'],
        mode: 'all',
        modifier: 'world'
    } as any
}));

let goLeft = false;
const moveInterval = setInterval(() => {
    // Change animation orientation.
    ww.postMessage(instanceChanges({
        id: 'slime2',
        changes: {
            compass: goLeft ? COMPASS.W : COMPASS.E,
            velocity: goLeft ? -5 : 5
        } as any
    }));
    goLeft = !goLeft;
}, 5000);

// Add a canvas to render to.
ww.postMessage(engineCanvas({
    canvas
}), [canvas]);
// Start engine to render.
ww.postMessage(engineStart());

setTimeout(() => {
    clearInterval(moveInterval);
    // ww.postMessage(engineStop());
}, 11000);
configurePlayer(ww);
