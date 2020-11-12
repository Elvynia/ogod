"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodFactoryReactiveParent = exports.ogodFactoryParent = void 0;
const hybrids_1 = require("hybrids");
exports.ogodFactoryParent = (category) => hybrids_1.parent((hybrids) => hybrids.category === category);
exports.ogodFactoryReactiveParent = (category, changesAction, connect) => {
    return Object.assign(Object.assign({}, exports.ogodFactoryParent(category)), { connect: (host, key, invalidate) => {
            host.state[key] = host[key].state;
            if (connect) {
                return connect(host, key, invalidate);
            }
        } });
};
//# sourceMappingURL=parent.js.map