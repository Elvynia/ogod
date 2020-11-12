import { PixiStateWorld } from "./state";
import { OgodRuntimeSystemDefault, OgodRuntimeEngine } from "@ogod/runtime-core";
import { from } from "rxjs";
import { map } from "rxjs/operators";

declare var self: OgodRuntimeEngine;

export class PixiRuntimeWorld extends OgodRuntimeSystemDefault {

    update(delta: number, state: PixiStateWorld) {
        const fullState = self.store.getState();
        const follow: any = state.follow ? fullState.instance[state.follow] : null;
        if (follow && state.camera && state.camera.offset) {
            const camera = state.camera;
            const bounds = state.bounds;
            let offsetXMin = camera.x + camera.worldX + camera.offset.minX;
            let offsetXMax = camera.x + camera.worldX + camera.offset.maxX;
            let offsetYMin = camera.y + camera.worldY + camera.offset.minY;
            let offsetYMax = camera.y + camera.worldY + camera.offset.maxY;
            // FIXME: Follow instance width/height.
            if (follow.worldX < offsetXMin || follow.worldX > offsetXMax
                || follow.worldY < offsetYMin || follow.worldY > offsetYMax) {
                const translation = {
                    x: follow.worldX - camera.worldX - camera.offset.minX - (camera.offset.maxX - camera.offset.minX) / 2,
                    y: follow.worldY - camera.worldY - camera.offset.minY - (camera.offset.maxY - camera.offset.minY) / 2
                };
                if (bounds) {
                    if (camera.worldX + translation.x < bounds.minX) {
                        translation.x = bounds.minX - camera.worldX;
                    }
                    if (camera.worldY < bounds.minY) {
                        translation.y = bounds.minY - camera.worldY;
                    }
                    if (camera.worldX + camera.width > bounds.maxX) {
                        translation.x = bounds.maxX - camera.width - camera.worldX;
                    }
                    if (camera.worldY + translation.y >= bounds.maxY) {
                        translation.y = bounds.maxY - camera.height - camera.worldY;
                    }
                }
                if (translation.x !== 0 || translation.y !== 0) {
                    state.translation = translation;
                }
            } else {
                state.translation = null;
            }
            if (state.translation) {
                if (state.translation.x !== 0 || state.translation.y !== 0) {
                    if (state.translation.x !== 0) {
                        const stepX = delta * state.translation.x / 1000;
                        if (Math.abs(state.translation.x) <= stepX) {
                            camera.worldX += state.translation.x;
                            state.translation.x = 0;
                        } else {
                            camera.worldX += stepX;
                            state.translation.x -= stepX;
                        }
                    }
                    if (state.translation.y !== 0) {
                        const stepY = delta * state.translation.y / 1000;
                        if (Math.abs(state.translation.y) <= stepY) {
                            camera.worldY += state.translation.y;
                            state.translation.y = 0;
                        } else {
                            camera.worldY += stepY;
                            state.translation.y -= stepY;
                        }
                    }
                } else {
                    state.translation = null;
                }
            }
            from(state.entities).pipe(
                map((id) => fullState.instance[id] as any),
            ).subscribe((instance) => {
                instance.instance$.position.x = camera.x + instance.worldX - camera.worldX;
                instance.instance$.position.y = camera.y + camera.height - (instance.worldY - camera.worldY);
            });
        }
    }
}