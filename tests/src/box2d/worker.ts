import { OgodBox2dRegistry } from '@ogod/runtime-box2d';
import { ogodWorkerStream, OgodRuntimeEngine } from '@ogod/runtime-core';
import { OgodD2Registry } from '@ogod/runtime-d2';

declare var self: OgodRuntimeEngine;

self.debugMode = true;
self.onmessage = ogodWorkerStream({
    ...OgodD2Registry,
    ...OgodBox2dRegistry
}, '/');
