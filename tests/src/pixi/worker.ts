import { OgodBox2dRegistry } from '@ogod/runtime-box2d';
import { OgodDefaultRegistry } from '@ogod/runtime-core';

declare var self: any;

// FIXME: Interop compatibility if rxjs loaded multiple times.
if (typeof Symbol === 'function') {
    if (!Symbol.observable) {
        (Symbol as any).observable = Symbol('observable');
    }
}
// FIXME: Pixi Worker support.
(self as any).document = {
    createElement(type) {
        if (type === 'canvas') {
            const canvas = new OffscreenCanvas(0, 0);
            return canvas;
        } else {
            console.log('CreateElement called with type = ', type);

            return {
                style: {},
            };
        }
    },

    addEventListener() { },
};
(self as any).window = {
    console: self.console,
    addEventListener() { },
    navigator: {},
    document: self.document,
    removeEventListener: function () { },
    WebGLRenderingContext: self.WebGLRenderingContext,
    WebGL2RenderingContext: self.WebGL2RenderingContext
};
(self as any).HTMLVideoElement = function () { };
(self as any).HTMLCanvasElement = function () { };
(self as any).HTMLImageElement = function () { };

import * as PIXI from 'pixi.js';
(self as any).PIXI = PIXI;
import { OgodPixiRegistry, pixiWorkerStream } from '@ogod/runtime-pixi';
import { PixiRuntimeHero } from './hero/runtime';
import { PixiRuntimeLevel } from './level/runtime';
import { PixiRuntimeDebugBox2d } from './scene/runtime';

self.debugMode = true;
self.onmessage = pixiWorkerStream({
    ...OgodDefaultRegistry,
    ...OgodBox2dRegistry,
    ...OgodPixiRegistry,
    'instance.level': PixiRuntimeLevel,
    'instance.hero': PixiRuntimeHero,
    'scene.box2d-debug': PixiRuntimeDebugBox2d
}, '/');
