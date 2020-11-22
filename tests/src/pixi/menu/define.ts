import { sceneChanges, instanceChanges, instanceDestroy, instanceInit } from '@ogod/common';
import { define, html, property } from 'hybrids';
import { ogodFactoryParent } from '@ogod/element-core';

const switchMenuListener = (host) => (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
        host.menuOff = !host.menuOff;
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

export function demoDefineMenu() {
    return define('demo-menu', {
        engine: ogodFactoryParent('engine'),
        debugId: property('debug'),
        debugActive: false,
        heroId: property('hero'),
        menuOff: property(true, (host) => {
            const listener = switchMenuListener(host);
            window.addEventListener('keyup', listener);
            return () => window.removeEventListener('keyup', listener);
        }),
        render: ({ menuOff, debugActive }) => menuOff ? html`` : html`
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
            <style>
                div.menu {
                    background-color: rgba(0, 0, 0, 0.6);
                }
                button.menu-item {
                    width: 60%;
                    height: 10%;
                    margin: 4rem 0;
                }
            </style>
            <div class="menu d-flex flex-column justify-content-center align-items-center h-100">
                <button class="menu-item btn btn-primary" onclick=${resetHero}>RESTART</button>
                <button class="menu-item btn btn-primary">OPTIONS</button>
                <button class="menu-item btn btn-primary" onclick=${switchDebug}>${ debugActive ? 'DISABLE' : 'ENABLE' } BOX2D DEBUG</button>
            </div>
        `
    } as any);
}
