import { engineInit, engineCanvas, engineStart, engineStop, systemInit, OGOD_CATEGORY, sceneInit, instanceInit, sceneChanges } from '@ogod/common';
import { D2StateScene, D2StateShape } from '@ogod/runtime-d2';
import { OgodStateTranslate } from '@ogod/runtime-core';

const canvas = (document.getElementById('test-canvas') as HTMLCanvasElement).transferControlToOffscreen();
const ww = new Worker('./coreWorker.js', { type: 'module' });
// Initialize worker engine.
ww.postMessage(engineInit({
    id: 'test-engine',
    categories: Object.values(OGOD_CATEGORY)
}));

const sceneId = 'test-scene';
// Add systems.
ww.postMessage(systemInit({
    id: 'translate-system',
    state: {
        id: 'translate-system',
        category: OGOD_CATEGORY.SYSTEM,
        runtime: 'translate',
        active: true,
        aspects: ['tx', 'ty'],
        mode: 'any',
        updates: [],
        watches: [],
        reflects: [],
        tick: true,
        borderMode: 'bounce',
        scale: 0.1,
        width: canvas.width,
        height: canvas.height
    } as any
}));
// Add a scene.
ww.postMessage(sceneInit({
    id: sceneId,
    state: {
        id: sceneId,
        category: OGOD_CATEGORY.SCENE,
        runtime: 'default',
        active: true,
        clear: true,
        updates: [],
        watches: [],
        reflects: [],
        tick: false
    } as D2StateScene
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
        x: 15,
        y: 15,
        tx: 1,
        ty: 2.5,
        color: 'green',
        size: 25,
        width: 25,
        height: 25,
        updates: [],
        watches: [],
        reflects: [],
        tick: false
    } as any
}));
// Add an instance into the scene.
ww.postMessage(instanceInit({
    id: 'test-square',
    state: {
        id: 'test-square',
        scenes: [sceneId],
        category: OGOD_CATEGORY.INSTANCE,
        runtime: 'square',
        active: true,
        x: 100,
        y: 50,
        tx: -2,
        ty: -1,
        color: 'blue',
        size: 25,
        width: 25,
        height: 25,
        updates: [],
        watches: [],
        reflects: [],
        tick: false
    } as any
}));

// Add a canvas to render to.
ww.postMessage(engineCanvas({
    canvas
}), [canvas]);
// Start engine to render.
ww.postMessage(engineStart());

(window as any).ogod = ww;
const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('change', (e) => {
    ww.postMessage(sceneChanges({
        id: sceneId,
        changes: {
            clear: (e.target as HTMLInputElement).checked
        } as any
    }));
});

ww.onmessage = (e) => {
    console.log('Reflecting states :', e.data)
};

// Stop to debug.
// setTimeout(() => 
//     ww.postMessage(engineStop()),
// 1000);
