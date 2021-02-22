import { PerspectiveCamera } from 'three';
import { ThreeRuntimeEngine } from '../../engine/runtime';
import { ThreeStateCamera } from './state';

declare var self: ThreeRuntimeEngine;

export function threeCreateCamera(camera: ThreeStateCamera): PerspectiveCamera {
    let aspectRatio = camera.ratio;
    if (aspectRatio === 0) {
        aspectRatio = self.canvas.width / self.canvas.height;
    }
    const instance = new PerspectiveCamera(camera.fov, aspectRatio, camera.near, camera.far);
    if (camera.up) {
        instance.up.set(camera.up.x, camera.up.y, camera.up.z);
    }
    if (camera.lookAt) {
        instance.lookAt(camera.lookAt.x, camera.lookAt.y, camera.lookAt.z);
    }
    if (camera.position) {
        instance.position.set(camera.position.x, camera.position.y, camera.position.z);
    }
    return instance;
}
