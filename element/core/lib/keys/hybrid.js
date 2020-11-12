"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridInstanceKeys = exports.ogodHybridKeys = void 0;
const property_1 = require("../factory/property");
const children_1 = require("../factory/children");
function ogodHybridKeys() {
    return {
        category: 'keys',
        active: property_1.ogodFactoryInstanceProperty(false),
        values: children_1.ogodFactoryInstanceChildren('key', true, (host) => {
            const keyDownListener = (e) => {
                const listened = host.values.find((value) => value.code ? value.code === e.code : value.keyCode === e.keyCode);
                if (listened) {
                    listened.pressed = true;
                }
            };
            const keyUpListener = (e) => {
                const listened = host.values.find((value) => value.code ? value.code === e.code : value.keyCode === e.keyCode);
                if (listened) {
                    listened.pressed = false;
                }
            };
            window.addEventListener('keydown', keyDownListener);
            window.addEventListener('keyup', keyUpListener);
            return () => {
                window.removeEventListener('keydown', keyDownListener);
                window.removeEventListener('keyup', keyUpListener);
            };
        }),
    };
}
exports.ogodHybridKeys = ogodHybridKeys;
function ogodHybridInstanceKeys() {
    return {
        keys: children_1.ogodFactoryInstanceChildren('keys')
    };
}
exports.ogodHybridInstanceKeys = ogodHybridInstanceKeys;
//# sourceMappingURL=hybrid.js.map