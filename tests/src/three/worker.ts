import { OgodDefaultRegistry, OgodRuntimeEngine } from '@ogod/runtime-core';
import { OgodThreeRegistry, threeWorkerStream } from '@ogod/runtime-three';
import { TextureLoader, BoxBufferGeometry, ImageBitmapLoader, MeshBasicMaterial, MeshPhongMaterial, PlaneBufferGeometry, RGBAFormat, RGBFormat, SphereBufferGeometry, Texture } from 'three';

declare var self: OgodRuntimeEngine;

TextureLoader.prototype.load = function ( url, onLoad, onProgress, onError ) {
    const texture = new Texture();
    const loader = new ImageBitmapLoader( this.manager );
    loader.setCrossOrigin( this.crossOrigin );
    loader.setPath( this.path );
    loader.load( url, function ( image ) {
        texture.image = image;
        const isJPEG = url.search( /\.jpe?g($|\?)/i ) > 0 || url.search( /^data\:image\/jpeg/ ) === 0;
        texture.format = isJPEG ? RGBFormat : RGBAFormat;
        texture.needsUpdate = true;
        if ( onLoad !== undefined ) {
            onLoad( texture );
        }
    }, onProgress, onError );
    return texture;
};

self.debugMode = true;
self.onmessage = threeWorkerStream({
    ...OgodDefaultRegistry,
    ...OgodThreeRegistry,
    'geometry.BoxBuffer': BoxBufferGeometry,
    'geometry.SphereBuffer': SphereBufferGeometry,
    'geometry.PlaneBuffer': PlaneBufferGeometry,
    'material.MeshBasic': MeshBasicMaterial,
    'material.MeshPhong': MeshPhongMaterial
}, '/');
