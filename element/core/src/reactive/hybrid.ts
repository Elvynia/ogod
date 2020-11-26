import { ActionCreator, OgodCategoryState } from '@ogod/common';
import { Hybrids, property } from 'hybrids';
import { ogodFactoryReactiveProperty } from '../factory/property';
import { ogodFactoryReactiveArrayString } from '../factory/array';
import { OgodElementReactive } from './element';
import { ogodFactoryReactiveBoolean } from '../factory/boolean';

export function ogodHybridReactive<C extends string>(changesCreator: ActionCreator, active: boolean = true): Hybrids<OgodElementReactive<C>> {
    return {
        active: ogodFactoryReactiveBoolean(active, changesCreator),
        tick: ogodFactoryReactiveProperty(false, changesCreator),
        updates: ogodFactoryReactiveArrayString([], changesCreator),
        watches: ogodFactoryReactiveArrayString([], changesCreator),
        reflects: ogodFactoryReactiveArrayString([], changesCreator),
        bindings: property('', (host) => {
            if (host.bindings) {
                const binds = host.bindings.split(' ');
                binds.forEach((bind) => {
                    if (bind.match(/.*[$%#]{1}$/)) {
                        const mode = bind[bind.length - 1];
                        bind = bind.substring(0, bind.length - 1);
                        if (mode === '$' || mode === '#') {
                            host.watches.push(bind);
                        }
                        if (mode === '%' || mode === '#') {
                            host.reflects.push(bind);
                        }
                    }
                    host.updates.push(bind);
                })
            }
        })
    };
}
