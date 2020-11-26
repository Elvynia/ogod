import { ogodFactoryParent } from '@ogod/element-core';
import { define, html, render } from 'hybrids';

// const changeAnimation = (host) => host.animation = 'run/1';
const changeAnimation = (host) => host.duration = 1200;

export function demoDefineDummy() {
    return define('demo-dummy', {
        engine: ogodFactoryParent('engine'),
        duration: 600,
        animation: 'idle/1',
        playing: true,
        loop: true,
        render: render<any>(({ duration, animation, playing, loop }) => html`
        <div class="container">
            <button class="btn btn-secondary" onclick=${changeAnimation}>Change</button>
        </div>
        <pixi-sprite-animated id="dummy" scale-x="2" scale-y="2" index="5" resource="adventurer"
            animation="idle/1" duration="600" duration=${duration} playing loop tick>
        </pixi-sprite-animated>
        `, { shadowRoot: false })
    } as any);
}
