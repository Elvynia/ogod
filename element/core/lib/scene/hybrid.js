"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ogodHybridScene = void 0;
const hybrids_1 = require("hybrids");
const property_1 = require("../factory/property");
function ogodHybridScene() {
    return {
        template: property_1.ogodFactorySceneProperty(false, null, (host, value, lastValue) => {
            if (value && !lastValue) {
                const target = host.render(host);
                const template = target.querySelector('slot').assignedNodes().find((item) => item instanceof HTMLTemplateElement);
                if (template) {
                    const node = template.content.cloneNode(true);
                    host.shadowRoot.appendChild(node);
                }
            }
            else if (lastValue && !value) {
                host.shadowRoot.innerHTML = '<slot></slot>';
            }
        }),
        render: () => hybrids_1.html `<slot></slot>`
    };
}
exports.ogodHybridScene = ogodHybridScene;
//# sourceMappingURL=hybrid.js.map