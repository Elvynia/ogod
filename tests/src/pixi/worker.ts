import { ogodWorkerStream } from '@ogod/runtime-core';
import { OgodPixiRegistry } from '@ogod/runtime-pixi';

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
(self as any).HTMLVideoElement = function() { };
(self as any).HTMLCanvasElement = function() { };
(self as any).HTMLImageElement = function() { };

import * as PIXI from 'pixi.js';
(self as any).PIXI = PIXI;

self.debugMode = true;
self.onmessage = ogodWorkerStream(OgodPixiRegistry, '/');
