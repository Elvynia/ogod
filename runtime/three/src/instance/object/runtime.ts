import { OgodActionInstance } from '@ogod/common';
import { ActionsObservable } from 'redux-observable';
import { from, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ImageBitmapLoader, RGBAFormat, RGBFormat, Texture, TextureLoader } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ThreeRuntimeEngine } from '../../engine/runtime';
import { ThreeStateEngine } from '../../engine/state';
import { ThreeRuntimeInstance } from './../default/runtime';
import { ThreeImportType, ThreeStateObject } from './state';

declare var self: ThreeRuntimeEngine;

// FIXME: ImageLoader not working in web worker.
TextureLoader.prototype.load = function (url, onLoad, onProgress, onError) {
    const texture = new Texture();
    const loader = new ImageBitmapLoader(this.manager);
    loader.setCrossOrigin(this.crossOrigin);
    loader.setPath(this.path);
    loader.load(url, function (image) {
        texture.image = image;
        const isJPEG = url.search(/\.jpe?g($|\?)/i) > 0 || url.search(/^data\:image\/jpeg/) === 0;
        texture.format = isJPEG ? RGBFormat : RGBAFormat;
        texture.needsUpdate = true;
        if (onLoad !== undefined) {
            onLoad(texture);
        }
    }, onProgress, onError);
    return texture;
};

export class ThreeRuntimeObject extends ThreeRuntimeInstance {

    initialize(state: ThreeStateObject, state$: Observable<ThreeStateEngine>, action$: ActionsObservable<any>): Observable<OgodActionInstance> {
        const path = (self.baseHref + state.path).replace(/\/\//g, '/');
        if (state.type === ThreeImportType.OBJ_MTL) {
            const loader = new MTLLoader();
            return from(loader.loadAsync(path + '.mtl')).pipe(
                switchMap((materials: MTLLoader.MaterialCreator) => {
                    materials.preload();
                    const objLoader = new OBJLoader();
                    objLoader.setMaterials(materials);
                    return from(objLoader.loadAsync(path + '.obj'));
                }),
                switchMap((object) => super.initializeSuccess({
                    ...state,
                    object$: object
                }))
            );
        } else if (state.type === ThreeImportType.GLTF) {
            const loader = new GLTFLoader();
            return from(loader.loadAsync(path)).pipe(
                switchMap((obj) => {
                    console.log('loaded data:', obj);
                    return this.initializeSuccess({
                        ...state,
                        object$: (obj as any).scene
                    })
                })
            );
        } else {
            return throwError('Cannot initialize object through loader without type information in state.');
        }
    }
}
