import { instanceInit, instanceDestroy, instanceRemove } from '@ogod/common';
import { html, property } from 'hybrids';
import { ogodDefineEngine, ogodFactoryInstanceChildren, ogodFactoryInstanceBoolean } from "@ogod/element-core";
import { d2DefineCircle, d2DefineRect, d2DefineScene } from '@ogod/element-d2';
import { box2dDefineBody, box2dDefineShapeCircle, box2dDefineShapeBox, box2dDefinePhysics, box2dDefineDebug, box2dDefineFixture } from '@ogod/element-box2d';

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

ogodDefineEngine(null, [{
    cleanup: property(true, (host) => {
        host.update$.subscribe(({ id, state }) => {
            if (state.y > 1000) {
                host.worker.postMessage(instanceDestroy({ id }));
            }
        })
    })
}]);
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
box2dDefineBody(null, [], [{ 
    fixedRotation: ogodFactoryInstanceBoolean(false)
}]);
box2dDefineFixture();
box2dDefineShapeBox();
box2dDefineShapeCircle();
box2dDefinePhysics();
box2dDefineDebug();
