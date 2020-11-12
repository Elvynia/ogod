import { engineInit, systemInit, OGOD_CATEGORY, sceneInit, instanceInit, engineCanvas, engineStart } from "@ogod/common";
import { Box2dStatePhysics, Box2dStateDebug } from "@ogod/runtime-box2d";
import { D2StateShape, D2StateScene } from "@ogod/runtime-d2";
import { generateGrounds } from "./ground";

const physicsId = 'physics-system';
const sceneId = 'scene';

const canvas = (document.getElementById('test-canvas') as HTMLCanvasElement).transferControlToOffscreen();
const ww = new Worker('./box2dWorker.js', { type: 'module' });
// Initialize worker engine.
ww.postMessage(engineInit({
    id: 'test-engine'
}));
// Add systems.
ww.postMessage(systemInit({
    id: 'translate-system',
    state: {
        id: 'physics-system',
        category: OGOD_CATEGORY.SYSTEM,
        runtime: 'physics',
        active: true,
        aspects: ['body'],
        mode: 'any',
        updates: [],
        reflects: [],
        tick: true,
        gravityY: 9.8
    } as Box2dStatePhysics
}));
// Add a scene.
ww.postMessage(sceneInit({
    id: sceneId,
    state: {
        id: sceneId,
        category: OGOD_CATEGORY.SCENE,
        runtime: 'default',
        active: true,
        updates: [],
        reflects: [],
        tick: false,
        clear: true
    } as D2StateScene
}));
// Add debug.
ww.postMessage(sceneInit({
    id: 'debug',
    state: {
        id: 'debug',
        category: OGOD_CATEGORY.SCENE,
        runtime: 'box2d-debug',
        active: true,
        updates: [],
        reflects: [],
        tick: true,
        draw: true,
        physicsId
    } as Box2dStateDebug
}));
// Add an instance into the scene.
ww.postMessage(instanceInit({
    id: 'test-shape',
    state: {
        id: 'test-shape',
        scenes: [sceneId],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'default',
        active: true,
        type: 'circle',
        x: 200,
        y: 0,
        color: '#626c66',
        size: 20,
        updates: [],
        reflects: [],
        tick: false,
        body: {
            dynamic: true,
            x: 20,
            y: 0,
            density: 10,
            friction: 0.1,
            restitution: 0.2,
            shape: {
                x: 0,
                y: 0,
                radius: 1
            }
        }
    } as any
}));
generateGrounds(ww, sceneId, {
    bottom: {
        x: 0,
        y: 600,
        sizeX: 1200,
        sizeY: 10
    },
    slide_1: {
        x: 100,
        y: 450,
        sizeX: 600,
        sizeY: 10,
        angle: 0.3
    },
    slide_2: {
        x: 600,
        y: 300,
        sizeX: 600,
        sizeY: 10,
        angle: -0.4
    },
    slide_3: {
        x: 0,
        y: 100,
        sizeX: 500,
        sizeY: 10,
        angle: 0.4
    },
    slide_4: {
        x: 300,
        y: 220,
        sizeX: 600,
        sizeY: 10
    },
    wall_E: {
        x: 1190,
        y: 0,
        sizeX: 10,
        sizeY: 600
    },
    wall_W: {
        x: 0,
        y: 0,
        sizeX: 10,
        sizeY: 600
    }
});

function generateUuid(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
}

window.addEventListener('click', (e) => {
    const ballId = generateUuid();
    ww.postMessage(instanceInit({
        id: ballId,
        state: {
            id: ballId,
            scenes: [sceneId],
            category: OGOD_CATEGORY.INSTANCE,
            runtime: 'default',
            active: true,
            type: 'circle',
            x: 200,
            y: 0,
            color: '#626c66',
            size: 20,
            updates: [],
            reflects: [],
            tick: false,
            body: {
                dynamic: true,
                x: 20,
                y: 0,
                density: 10,
                friction: 0.1,
                restitution: 0.2,
                shape: {
                    x: 0,
                    y: 0,
                    radius: 1
                }
            }
        } as any
    }));   
})

// Add a canvas to render to.
ww.postMessage(engineCanvas({
    canvas
}), [canvas]);
// Start engine to render.
ww.postMessage(engineStart());
