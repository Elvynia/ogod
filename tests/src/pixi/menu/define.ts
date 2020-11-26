import { instanceDestroy, instanceInit, sceneChanges } from '@ogod/common';
import { ogodFactoryParent } from '@ogod/element-core';
import { define, html, property, render } from 'hybrids';
import { rendererChanges } from '@ogod/runtime-pixi';

const resolutions = [null, { width: 800, height: 600 }, { width: 1280, height: 768 }, { width: 1920, height: 1080 }];

const switchMenuListener = (host) => (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
        host.menuOff = !host.menuOff;
        if (!host.menuOff) {
            host.menuOptions = false;
        }
    }
}

const switchDebug = (host) => {
    host.debugActive = !host.debugActive;
    host.engine.worker.postMessage(sceneChanges({ id: host.debugId, changes: { active: host.debugActive } }));
}

const resetHero = (host) => {
    const hero: any = document.getElementById(host.heroId);
    host.engine.worker.postMessage(instanceDestroy({ id: host.heroId }));
    host.engine.worker.postMessage(instanceInit({ id: host.heroId, state: hero.state }));
}

const switchOptions = (host) => host.menuOptions = !host.menuOptions;

const changeResolution = (host, event) => {
    host.optionResolution = event.target.value;
    host.engine.worker.postMessage(rendererChanges({ id: host.rendererId, changes: resolutions[host.optionResolution] }));
}

export function demoDefineMenu() {
    return define('demo-menu', {
        engine: ogodFactoryParent('engine'),
        debugId: property('debug'),
        heroId: property('hero'),
        rendererId: property('ogod-renderer-default'),
        debugActive: false,
        menuOff: property(true, (host) => {
            const listener = switchMenuListener(host);
            window.addEventListener('keyup', listener);
            return () => window.removeEventListener('keyup', listener);
        }),
        menuOptions: false,
        optionResolution: 3,
        render: render((host: any) => host.menuOff ? html`` : html`
            <style>
                div.menu {
                    background-color: rgba(0, 0, 0, 0.6);
                }
                button.menu-item {
                    width: 60%;
                    height: 10%;
                    margin: 4rem 0;
                }
                div.text {
                    color: white;
                }
            </style>
            ${ host.menuOptions ? html`
                <div class="menu d-flex flex-column h-100">
                    <div class="container d-flex justify-content-around my-5">
                        <div class="text">Resolution</div>
                        <select onchange=${changeResolution}>
                            <option value="1" selected=${host.optionResolution == 1}>800 x 600</option>
                            <option value="2" selected=${host.optionResolution == 2}>1280 x 768</option>
                            <option value="3" selected=${host.optionResolution == 3}>1920 x 1080</option>
                        </select>
                    </div>
                </div>
            ` : html`
                <div class="menu d-flex flex-column justify-content-center align-items-center h-100">
                    <button class="menu-item btn btn-primary" onclick=${resetHero}>RESTART</button>
                    <button class="menu-item btn btn-primary" onclick=${switchOptions}>OPTIONS</button>
                    <button class="menu-item btn btn-primary" onclick=${switchDebug}>${host.debugActive ? 'DISABLE' : 'ENABLE'} BOX2D DEBUG</button>
                </div>
            `}
        `, { shadowRoot: false })
    } as any);
}
