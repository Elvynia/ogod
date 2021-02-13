import { range } from 'rxjs';
import { engineInit, OGOD_CATEGORY, sceneInit, instanceInit, engineStart, engineCanvas, instanceChanges, resourceInit } from '@ogod/common';
import { rendererInit, ThreeStateScene } from '@ogod/runtime-three';
import { DoubleSide, MathUtils } from 'three';
import { reduce } from 'rxjs/operators';

const canvas = (document.getElementById('test-canvas') as HTMLCanvasElement).transferControlToOffscreen();
const ww = new Worker('./threeWorker.js', { type: 'module' });
// Initialize worker engine.
ww.postMessage(engineInit({
    id: 'test-engine',
    categories: [...Object.values(OGOD_CATEGORY), 'renderer']
}));
// Add a renderer.
ww.postMessage(rendererInit({
    id: 'default',
    state: {
        id: 'default',
        category: 'renderer',
        runtime: 'default',
        alpha: true,
        antialias: true
    } as any
}));
// Add a scene.
ww.postMessage(sceneInit({
    id: 'scene',
    state: {
        id: 'scene',
        category: OGOD_CATEGORY.SCENE,
        runtime: 'default',
        active: true,
        updates: [],
        watches: [],
        reflects: [],
        tick: false,
        camera: {
            fov: 45,
            ratio: canvas.width / canvas.height,
            near: 1,
            far: 1000
        },
        background: 0x5B8E7D
    } as ThreeStateScene
}));
ww.postMessage(resourceInit({
    id: 'crate',
    state: {
        id: 'crate',
        category: OGOD_CATEGORY.RESOURCE,
        runtime: 'texture',
        path: '/assets/crate.gif'
    }
}));
// Add an instance into the scene.
ww.postMessage(instanceInit({
    id: 'box',
    state: {
        id: 'box',
        scenes: ['scene'],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'mesh',
        active: true,
        updates: [],
        watches: [],
        reflects: [],
        tick: true,
        material: {
            type: 'MeshPhong',
            args: [{ color: 0xF4A259 }]
        },
        geometry: {
            type: 'Box',
            buffered: true,
            args: [5, 5, 5]
        },
        rotator: {
            x: 1,
            y: 1.5,
            z: 0.2
        },
        position: {
            x: 0,
            y: -22,
            z: 0
        },
        resource: 'crate'
    } as any
}));
// // Add a point light.
ww.postMessage(instanceInit({
    id: 'light-point',
    state: {
        id: 'light-point',
        scenes: ['scene'],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'light-point',
        // active: true,
        updates: [],
        watches: [],
        reflects: [],
        tick: false,
        intensity: 1,
        distance: 10,
        decay: 0,
        position: {
            x: 0,
            y: -1,
            z: 0
        }
    } as any
}));
// Add a spot light.
ww.postMessage(instanceInit({
    id: 'light-spot',
    state: {
        id: 'light-spot',
        scenes: ['scene'],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'light-spot',
        active: true,
        updates: [],
        watches: [],
        reflects: [],
        tick: false,
        intensity: 1,
        distance: 100,
        angle: Math.PI / 2,
        penumbra: 0,
        decay: 0,
        position: {
            x: 10,
            y: 100,
            z: 10
        }
    } as any
}));
// Add an ambient light.
ww.postMessage(instanceInit({
    id: 'light-ambient',
    state: {
        id: 'light-ambient',
        scenes: ['scene'],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'light-ambient',
        active: false,
        updates: [],
        watches: [],
        reflects: [],
        tick: false,
        intensity: 0.4
    } as any
}));
// Add Points (particles).
const randPos = () => MathUtils.randFloatSpread(2000);
let particlesVertices;
range(0, 10000).pipe(
    reduce((arr, i) => arr.concat([randPos(), randPos(), randPos()]), [])
).subscribe((vertices) => particlesVertices = vertices);
ww.postMessage(instanceInit({
    id: 'particles',
    state: {
        id: 'particles',
        scenes: ['scene'],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'points',
        active: true,
        updates: [],
        watches: [],
        reflects: [],
        tick: true,
        params: {
            color: 0xff0000,
            size: 10,

        },
        vertices: particlesVertices,
        translator: {
            x: 0,
            y: 0,
            z: 5,
        }
    } as any
}));
// Add fly controls.
let keys = {
    shift: false,
    up: false,
    down: false,
    left: false,
    right: false,
    forward: false,
    back: false,
    pitchUp: false,
    pitchDown: false,
    yawLeft: false,
    yawRight: false,
    rollLeft: false,
    rollRight: false,
    autoForward: false
};
ww.postMessage(instanceInit({
    id: 'controls',
    state: {
        id: 'controls',
        scenes: ['scene'],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'control-fly',
        active: true,
        updates: [],
        watches: [],
        reflects: [],
        tick: true,
        movementSpeed: 1,
        speedMultiplier: 10,
        rollSpeed: 0.005,
        position: { x: 0, y: -15, z: 50 }
    } as any
}));
// Add a canvas to render to.
ww.postMessage(engineCanvas({
    canvas
}), [canvas]);
// Start engine to render.
ww.postMessage(engineStart());

function bindLight(id: string, checkId: string) {
    document.getElementById(checkId).addEventListener('change', (e: any) => {
        ww.postMessage(instanceChanges({ id, changes: { active: e.target.checked } }));
    });
}

bindLight('light-point', 'pointCheck');
bindLight('light-spot', 'spotCheck');
bindLight('light-ambient', 'ambientCheck');
window.addEventListener('keydown', (e) => {
    let changes = keys;
    if (e.altKey || e.ctrlKey) {
        return;
    }
    switch (e.keyCode) {
        case 16: /*SHIFT*/ if (!changes.shift) changes = { ...changes, shift: true }; break;
        case 90: /*Z*/ if (!changes.forward) changes = { ...changes, forward: true }; break;
        case 83: /*S*/ if (!changes.back) changes = { ...changes, back: true }; break;
        case 81: /*Q*/ if (!changes.left) changes = { ...changes, left: true }; break;
        case 68: /*D*/ if (!changes.right) changes = { ...changes, right: true }; break;
        case 82: /*R*/ if (!changes.up) changes = { ...changes, up: true }; break;
        case 70: /*F*/ if (!changes.down) changes = { ...changes, down: true }; break;
        case 38: /*up*/ if (!changes.pitchUp) changes = { ...changes, pitchUp: true }; break;
        case 40: /*down*/ if (!changes.pitchDown) changes = { ...changes, pitchDown: true }; break;
        case 37: /*left*/ if (!changes.yawLeft) changes = { ...changes, yawLeft: true }; break;
        case 39: /*right*/ if (!changes.yawRight) changes = { ...changes, yawRight: true }; break;
        case 65: /*A*/ if (!changes.rollLeft) changes = { ...changes, rollLeft: true }; break;
        case 69: /*E*/ if (!changes.rollRight) changes = { ...changes, rollRight: true }; break;
    }
    if (changes !== keys) {
        keys = changes;
        ww.postMessage(instanceChanges({
            id: 'controls', changes: {
                keys: {
                    active: true,
                    values: Object.keys(keys).map((k) => ({ name: k, pressed: keys[k] }))
                }
            } as any
        }));
    }
});
window.addEventListener('keyup', (e) => {
    let changes = keys;
    switch (e.keyCode) {
        case 16: /*SHIFT*/ if (changes.shift) changes = { ...changes, shift: false }; break;
        case 90: /*Z*/ if (changes.forward) changes = { ...changes, forward: false }; break;
        case 83: /*S*/ if (changes.back) changes = { ...changes, back: false }; break;
        case 81: /*Q*/ if (changes.left) changes = { ...changes, left: false }; break;
        case 68: /*D*/ if (changes.right) changes = { ...changes, right: false }; break;
        case 82: /*R*/ if (changes.up) changes = { ...changes, up: false }; break;
        case 70: /*F*/ if (changes.down) changes = { ...changes, down: false }; break;
        case 38: /*up*/ if (changes.pitchUp) changes = { ...changes, pitchUp: false }; break;
        case 40: /*down*/ if (changes.pitchDown) changes = { ...changes, pitchDown: false }; break;
        case 37: /*left*/ if (changes.yawLeft) changes = { ...changes, yawLeft: false }; break;
        case 39: /*right*/ if (changes.yawRight) changes = { ...changes, yawRight: false }; break;
        case 65: /*A*/ if (changes.rollLeft) changes = { ...changes, rollLeft: false }; break;
        case 69: /*E*/ if (changes.rollRight) changes = { ...changes, rollRight: false }; break;
        case 87: /*W*/ changes = { ...changes, autoForward: !keys.autoForward }; break;
    }
    if (changes !== keys) {
        keys = changes;
        ww.postMessage(instanceChanges({
            id: 'controls', changes: {
                keys: {
                    active: true,
                    values: Object.keys(keys).map((k) => ({ name: k, pressed: keys[k] }))
                }
            } as any
        }));
    }
});

// Import objects

// Add an instance into the scene.
ww.postMessage(instanceInit({
    id: 'room',
    state: {
        id: 'room',
        scenes: ['scene'],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'object',
        active: true,
        updates: [],
        watches: [],
        reflects: [],
        path: 'assets/room_0/room_0',
        position: {
            x: 0,
            y: -50,
            z: 0
        }
    } as any
}));
