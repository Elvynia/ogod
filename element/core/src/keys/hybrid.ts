import { Hybrids } from 'hybrids';
import { OgodElementKeys, OgodElementInstanceKeys } from './element';
import { ogodFactoryInstanceProperty } from '../factory/property';
import { ogodFactoryInstanceChildren } from '../factory/children';

export function ogodHybridKeys(): Hybrids<OgodElementKeys> {
    return {
        category: 'keys',
        active: ogodFactoryInstanceProperty(false),
        values: ogodFactoryInstanceChildren('key', true, (host) => {
            const keyDownListener = (e: KeyboardEvent) => {
                const listened = host.values.find((value) => value.code ? value.code === e.code : value.keyCode === e.keyCode);
                if (listened) {
                    listened.pressed = true;
                }
            }
            const keyUpListener = (e: KeyboardEvent) => {
                const listened = host.values.find((value) => value.code ? value.code === e.code : value.keyCode === e.keyCode);
                if (listened) {
                    listened.pressed = false;
                }
            }
            window.addEventListener('keydown', keyDownListener);
            window.addEventListener('keyup', keyUpListener);
            return () => {
                window.removeEventListener('keydown', keyDownListener);
                window.removeEventListener('keyup', keyUpListener);
            }
        })
    };
}

export function ogodHybridInstanceKeys(): Hybrids<OgodElementInstanceKeys> {
    return {
        keys: ogodFactoryInstanceChildren('keys')
    };
}
