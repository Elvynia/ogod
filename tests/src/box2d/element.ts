import { instanceDestroy, instanceInit } from '@ogod/common';
import { box2dDefineBody, box2dDefineDebug, box2dDefineFixture, box2dDefinePhysics, box2dDefineShapeBox, box2dDefineShapeCircle } from '@ogod/element-box2d';
import { ogodDefineEngine, ogodFactoryChildren, ogodFactoryInstanceBoolean, ogodFactoryInstanceChildren } from "@ogod/element-core";
import { d2DefineCircle, d2DefineRect, d2DefineScene } from '@ogod/element-d2';
import { html, property } from 'hybrids';
import { filter } from 'rxjs/operators';

const addBalls = (host) => {
    if (host.interval) {
        clearInterval(host.interval);
        host.interval = 0;
    } else {
        host.interval = setInterval(() => {
            const id = host.id + '_' + Math.floor(Math.random() * Math.pow(10, 6));
            host.engine.worker.postMessage(instanceInit({
                id,
                state: {
                    ...host.state,
                    active: true,
                    body: {
                        ...host.state.body,
                        x: Math.floor(Math.random() * 100)
                    },
                    id
                }
            }));
            host.engine.tracking = [...host.engine.tracking, id];
        }, 100);
    }
};

ogodDefineEngine(null, [{
    ball: ogodFactoryChildren((h) => h.count != null, null, { deep: true, nested: true }),
    tracking: {
        ...property(['ball']),
        observe: (host, value, lastValue) => host.ball[0].count = value.length
    },
    cleanup: property(true, (host) => {
        host.update$.pipe(
            filter(({ state }) => state.y > 800)
        ).subscribe(({ id, state }) => {
            if (host.tracking.includes(id)) {
                host.tracking = host.tracking.filter((key) => key !== id);
                host.worker.postMessage(instanceDestroy({ id }));
            }
        });
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
