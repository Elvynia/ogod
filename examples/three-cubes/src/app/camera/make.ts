import { FeatureKey } from "@ogod/driver-engine";
import { first, map } from "rxjs";
import { PerspectiveCamera } from "three";
import { AppState, WorkerSources } from "../state";

export function makeUpdateCamera(state: AppState) {
    const rotateSpeed = 0.1 / 1000; // deg/s
    let moveSpeed = 1 / 1000;
    return [({ delta }) => {
        state.theta += delta * rotateSpeed % 360;
        if (state.radius < 1 || state.radius > 15) {
            moveSpeed *= -1;
        }
        state.radius += moveSpeed * delta;
        state.camera.position.x = state.radius * Math.sin(state.theta);
        state.camera.position.y = state.radius * Math.sin(state.theta);
        state.camera.position.z = state.radius * Math.cos(state.theta);

        state.camera.lookAt(state.scene.position);
        state.camera.updateMatrixWorld();
    }]
}

export function makeFeatureCamera(sources: WorkerSources): FeatureKey<AppState, 'camera'> {
    return {
        key: 'camera',
        publishOnNext: true,
        value$: sources.Engine.target$.pipe(
            first(),
            map((canvas) => new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 100))
        )
    }
}
