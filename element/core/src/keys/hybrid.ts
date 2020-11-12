import { Hybrids } from 'hybrids';
import { OgodElementKeys, OgodInstanceKeys } from './element';
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
        }),
        // ...ogodAsyncState()
    };
}

export function ogodHybridInstanceKeys(): Hybrids<OgodInstanceKeys> {
    return {
        keys: ogodFactoryInstanceChildren('keys')
    };
}
