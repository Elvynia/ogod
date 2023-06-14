import { makeHybridWorker } from './make';

describe('makeHybridWorker', () => {
  it('should work', () => {
    const TestComponent = {
        tag: 'make-hybrid-worker-test',
        worker: makeHybridWorker({
            canvasFn: () => document.createElement('canvas'),
            workerFn: () => new Worker(`
                self.postMessage('OGOD_ENGINE_INIT');
            `)
        })
    };
    expect(TestComponent.worker).toBeTruthy();
  });
});
