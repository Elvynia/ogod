import { ogodWorkerStream, OgodRuntimeEngine, OgodDefaultRegistry } from '@ogod/runtime-core';
import { OgodD2Registry, d2WorkerStream } from '@ogod/runtime-d2';

declare var self: OgodRuntimeEngine;

self.debugMode = true;
self.onmessage = d2WorkerStream({
    ...OgodDefaultRegistry,
    ...OgodD2Registry
}, '/');
