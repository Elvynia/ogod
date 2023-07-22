import { FeatureKey } from "@ogod/driver-engine";
import { makeRandColor, makeRandNum } from '@ogod/examples-common';
import { first, map } from "rxjs";
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import { AppState, WorkerSources } from "../state";

const ColorPalette = ['#BCB6FF', '#BACCFF', '#B8E1FF', '#B1F0FB', '#ADF8F9', '#A9FFF7', '#94FBAB', '#AFDC85', '#CABD5E'];

export function makeFeatureCubes(sources: WorkerSources): FeatureKey<AppState, 'cubes'> {
    return {
        key: 'cubes',
        value$: sources.Engine.state$.pipe(
            first(),
            map((state) => {
                const cubes = {};
                const geometry = new BoxGeometry();

                for (let i = 0; i < 2000; i++) {
                    const hex = ColorPalette[Math.floor(Math.random() * ColorPalette.length)];
                    const object = new Mesh(geometry, new MeshLambertMaterial({ color: hex }));

                    object.position.x = Math.random() * 40 - 20;
                    object.position.y = Math.random() * 40 - 20;
                    object.position.z = Math.random() * 40 - 20;

                    object.rotation.x = Math.random() * 2 * Math.PI;
                    object.rotation.y = Math.random() * 2 * Math.PI;
                    object.rotation.z = Math.random() * 2 * Math.PI;

                    object.scale.x = Math.random() + 0.5;
                    object.scale.y = Math.random() + 0.5;
                    object.scale.z = Math.random() + 0.5;

                    object.name = '#' + i;
                    cubes[object.name] = object;
                    state.scene.add(object);
                }
                return cubes;
            })
        )
    }
}
