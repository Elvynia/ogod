import { OgodElementInstanceRef } from './element';
import { Hybrids, property } from 'hybrids';
import { ogodFactoryParent } from '../factory/parent';
import { filter, first } from 'rxjs/operators';
import { instanceAdd, instanceRemove } from '@ogod/common';

export function ogodHybridInstanceRef(): Hybrids<OgodElementInstanceRef> {
    return {
        scene: ogodFactoryParent('scene'),
        target: property(''),
        active: {
            ...property(false),
            observe: ({ scene, target }, value, lastValue) => {
                if (scene && target && value !== lastValue) {
                    if (value) {
                        scene.engine.state$.pipe(
                            filter((fs) => fs[target] && fs[target].loaded),
                            first()
                        ).subscribe(() => scene.engine.worker.postMessage(instanceAdd({
                            id: target,
                            sceneId: scene.id
                        })));
                    } else if (lastValue) {
                        scene.engine.worker.postMessage(instanceRemove({
                            id: target,
                            sceneId: scene.id
                        }));
                    }
                }
            }
        }
    };
}
