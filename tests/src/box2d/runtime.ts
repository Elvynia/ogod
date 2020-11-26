import { engineCanvas, engineInit, engineStart, instanceInit, OGOD_CATEGORY, sceneInit, systemInit } from "@ogod/common";
import { Box2dStateDebug, Box2dStatePhysics } from "@ogod/runtime-box2d";
import { D2StateScene } from "@ogod/runtime-d2";
import { generateGrounds } from "./ground";

const physicsId = 'physics-system';
const sceneId = 'scene';

const canvas = (document.getElementById('test-canvas') as HTMLCanvasElement).transferControlToOffscreen();
const ww = new Worker('./box2dWorker.js', { type: 'module' });
// Initialize worker engine.
ww.postMessage(engineInit({
    id: 'test-engine',
    categories: Object.values(OGOD_CATEGORY)
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
        watches: [],
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
        watches: [],
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
        watches: [],
        reflects: [],
        tick: true,
        draw: true,
        physicsId
    } as Box2dStateDebug
}));
// Add an instance into the scene.
ww.postMessage(instanceInit({
    id: 'ball',
    state: {
        id: 'ball',
        scenes: [sceneId],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'default',
        active: true,
        type: 'circle',
        x: 200,
        y: 0,
        color: '#5899E2',
        size: 20,
        updates: [],
        watches: [],
        reflects: [],
        tick: false,
        body: {
            dynamic: true,
            x: 20,
            y: 0,
            fixtures: [{
                density: 10,
                friction: 0.1,
                restitution: 0.2,
                shape: {
                    x: 0,
                    y: 0,
                    radius: 1
                }
            }]
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
        x: 600,
        y: 80,
        sizeX: 400,
        sizeY: 10,
        angle: 0.4
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

let interval = null;
window.addEventListener('mousedown', (e) => {
    interval = setInterval(() => {
        const ballId = 'ball' + generateUuid();
        ww.postMessage(instanceInit({
            id: ballId,
            state: {
                id: ballId,
                scenes: [sceneId],
                category: OGOD_CATEGORY.INSTANCE,
                runtime: 'default',
                active: true,
                type: 'circle',
                color: '#5899E2',
                size: 20,
                updates: [],
                watches: [],
                reflects: [],
                tick: false,
                body: {
                    dynamic: true,
                    x: Math.floor(Math.random() * 100),
                    y: 0,
                    fixtures: [{
                        density: 10,
                        friction: 0.1,
                        restitution: 0.2,
                        shape: {
                            x: 0,
                            y: 0,
                            radius: 1
                        }
                    }]
                }
            } as any
        }));
    }, 100);
});
window.addEventListener('mouseup', (e) => {
    clearInterval(interval);
});
const balls = {};
const count = document.getElementById('count');
ww.onmessage = (e) => {
    Object.assign(balls, e.data.states
        .filter(({ state }) => state.id.startsWith('ball'))
        .reduce((a, b) => Object.assign(a, { [b.id]: b.state }), {}));
    count.textContent = Object.keys(balls).length.toString();
}

// Add a canvas to render to.
ww.postMessage(engineCanvas({
    canvas
}), [canvas]);
// Start engine to render.
ww.postMessage(engineStart());
