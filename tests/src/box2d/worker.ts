import { OgodBox2dRegistry } from '@ogod/runtime-box2d';
import { OgodDefaultRegistry, OgodRuntimeEngine } from '@ogod/runtime-core';
import { d2WorkerStream, OgodD2Registry } from '@ogod/runtime-d2';

declare var self: OgodRuntimeEngine;

self.debugMode = true;
self.onmessage = d2WorkerStream({
    ...OgodDefaultRegistry,
    ...OgodD2Registry,
    ...OgodBox2dRegistry
}, '/');
