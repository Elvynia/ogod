import { OgodElementRouter } from './element';
import { Hybrids, property } from 'hybrids';
import { ogodFactoryParent } from '../factory/parent';
import { sceneChanges } from '@ogod/common';

export function ogodHybridRouter(): Hybrids<OgodElementRouter> {
    return {
        engine: ogodFactoryParent('engine'),
        path: {
            ...property(''),
            observe: (host, value, lastValue) => {
                if (lastValue) {
                    host.engine.worker.postMessage(sceneChanges({
                        id: lastValue,
                        changes: { active: false }
                    }));
                }
                if (value) {
                    host.engine.worker.postMessage(sceneChanges({
                        id: value,
                        changes: { active: true }
                    }));
                }
            }
        },
        switch: property({}, (host) => {
            host.addEventListener('ogod-router', (e) => {
                if (host.switch.next) {
                    host.switch.next(host);
                }
            })
        })
    };
}
