import { FeatureKey } from "@ogod/driver-engine";
import { filter, first, map, switchMap } from "rxjs";
import { Cube } from "../cubes/state";
import { AppState, WorkerSources } from "../state";

export function makeFeatureSelected(sources: WorkerSources): FeatureKey<AppState, 'selected'> {
    return {
        key: 'selected',
        publishOnNext: true,
        value$: sources.Engine.state$.pipe(
            filter((state) => !!state.camera),
            first(),
            switchMap((state) => sources.Engine.engine$.pipe(
                map(() => {
                    state.raycaster.setFromCamera(state.pointer, state.camera);
                    const intersects = state.raycaster.intersectObjects(state.scene.children, false);
                    return intersects.length > 0 ? intersects[0].object as Cube : undefined;
                }),
                filter((intersects) => intersects !== state.selected),
                map((intersected) => {
                    if (state.selected) {
                        state.selected.material.emissive.setHex(state.selected.currentHex);
                    }
                    if (intersected) {
                        intersected.currentHex = intersected.material.emissive.getHex();
                        intersected.material.emissive.setStyle(state.selectColor);
                        return intersected;
                    } else {
                        return undefined;
                    }
                })
            ))
        )
    }
}
