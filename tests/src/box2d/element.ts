import { instanceInit } from '@ogod/common';
import { html } from 'hybrids';
import { ogodDefineEngine, ogodFactoryInstanceChildren } from "@ogod/element-core";
import { d2DefineCircle, d2DefineRect, d2DefineScene } from '@ogod/element-d2';
import { box2dDefineBody, box2dDefineShapeCircle, box2dDefineShapeBox, box2dDefinePhysics, box2dDefineDebug } from '@ogod/element-box2d';

const addBalls = (host) => {
    if (host.interval) {
        clearInterval(host.interval);
        host.interval = 0;
    } else {
        host.interval = setInterval(() => {
            ++host.count;
            const id = host.id + '_' + host.count;
            host.engine.worker.postMessage(instanceInit({
                id,
                state: {
                    ...host.state,
                    body: {
                        ...host.state.body,
                        x: Math.floor(Math.random() * 100)
                    },
                    id
                }
            }));
        }, 100);
    }
};

ogodDefineEngine();
d2DefineScene();
d2DefineCircle('d2-ball', [{
    body: ogodFactoryInstanceChildren('body'),
    count: 1,
    interval: 0,
    render: ({ count, interval }) => html`
        <div>
            <h1>Ball count : ${count}</h1>
            <button class="btn btn-primary" onclick=${addBalls}>${interval ? 'STOP' : 'START'}</button>
        </div>
    `
}]);
d2DefineRect('d2-ground', [{ body: ogodFactoryInstanceChildren('body') }]);
box2dDefineBody();
box2dDefineShapeBox();
box2dDefineShapeCircle();
box2dDefinePhysics();
box2dDefineDebug();