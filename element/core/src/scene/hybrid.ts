import { Hybrids, html } from 'hybrids';
import { OgodElementScene } from './element';
import { ogodFactorySceneProperty } from '../factory/property';

export function ogodHybridScene(): Hybrids<OgodElementScene> {
    return {
        template: ogodFactorySceneProperty(false, null, (host, value, lastValue) => {
            if (value && !lastValue) {
                const target = host.render(host);
                const template = target.querySelector('slot').assignedNodes().find((item) => item instanceof HTMLTemplateElement);
                if (template) {
                    const node = template.content.cloneNode(true);
                    host.shadowRoot.appendChild(node);
                }
            } else if (lastValue && !value) {
                host.shadowRoot.innerHTML = '<slot></slot>';
            }
        }),
        render: () => html`<slot></slot>`
    };
}
