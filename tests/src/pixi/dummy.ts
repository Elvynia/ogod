import { ogodFactoryParent } from '@ogod/element-core';
import { define, html, render } from 'hybrids';

const ANIMS = ['air_attack/1', 'air_attack/2' , 'air_attack/3',
    'attack/1', 'attack/2', 'attack/3',
    'bow', 'cast', 'corner_climb', 'corner_grab', 'corner_jump',
    'crouch', 'die', 'draw', 'drop_kick', 'fall', 'get_up', 'hurt',
    'idle/1', 'idle/2', 'idle/3', 'item', 'jump', 'jump_bow', 'kick',
    'knock_down', 'ladder_climb', 'run/1', 'run/2', 'run/3', 'run_punch',
    'sheath', 'slide', 'somersault', 'walk', 'wall_run', 'wall_slide'];
const changeAnimation = (host, e) => host.animation = e.target.value;
const changeDuration = (host, e) => {
    const val = e.target.value;
    if (val > 0) {
        host.duration = val;
    }
}
const changeLoop = (host, e) => host.loop = e.target.checked;

export function demoDefineDummy() {
    return define('demo-dummy', {
        engine: ogodFactoryParent('engine'),
        duration: 600,
        animation: 'idle/1',
        loop: false,
        render: render<any>(({ duration, animation, loop }) => html`
        <style>
            div.dummy {
                width: 300px;
                color: white;
                font-weight: bold;
                padding: 2rem;
                background-color: #0000004D;
            }
        </style>
        <div class="container dummy">
            <div class="form-group">
                <label for="inputAnim">Animation</label>
                <select id="inputAnim" class="form-control" onchange=${changeAnimation}>
                    ${ ANIMS.map((anim) => html`<option value=${anim} selected=${anim === animation ? 'selected' : ''}>${anim}</option>`)}
                </select>
            </div>
            <div class="form-group">
                <label for="inputDuration">Duration</label>
                <input id="inputDuration" type="number" class="form-control" step="100" value=${duration}
                    oninput=${changeDuration}>
            </div>
            <div class="form-group ml-3">
                <input id="inputLoop" type="checkbox" class="form-check-input" checked=${loop}
                    onchange=${changeLoop}>
                <label class="form-check-label" for="inputLoop">Loop</label>
            </div>
        </div>
        <pixi-sprite-animated id="dummy" scale-x="2" scale-y="2" index="5" resource="adventurer"
            animation=${animation} duration=${duration} playing loop=${loop} bindings="loop$ animation$" tick>
        </pixi-sprite-animated>
        `, { shadowRoot: false })
    } as any);
}
