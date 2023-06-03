import { of } from 'rxjs';
import { makeDriverGameWorker } from './make';
import { makeWorkerMessage } from '../message/make';

describe('DriverGameWorker', () => {
    it('should have state with running false', (done) => {
        const gameDriver = makeDriverGameWorker<{ running: boolean }>(new Worker(``));
        const sources = gameDriver(new Promise((resolve) => resolve(of(makeWorkerMessage({
            key: 'running',
            value: false
        })))));
        sources.input$.subscribe((state: any) => {
            expect(state).toHaveProperty('running', false);
            done();
        });
    });
});
