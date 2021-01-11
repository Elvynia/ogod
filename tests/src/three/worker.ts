import { OgodDefaultRegistry, OgodRuntimeEngine } from '@ogod/runtime-core';
import { OgodThreeRegistry, threeWorkerStream } from '@ogod/runtime-three';
import { BoxBufferGeometry, MeshPhongMaterial, PlaneBufferGeometry } from 'three';

declare var self: OgodRuntimeEngine;

self.debugMode = true;
self.onmessage = threeWorkerStream({
    ...OgodDefaultRegistry,
    ...OgodThreeRegistry,
    'geometry.BoxBuffer': BoxBufferGeometry,
    'geometry.PlaneBuffer': PlaneBufferGeometry,
    'material.MeshPhong': MeshPhongMaterial
}, '/');
