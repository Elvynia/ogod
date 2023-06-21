import { of } from 'rxjs';
import { makeMessage } from '../message/make';
import { makeDriverWorker } from './make';

describe('DriverWorker', () => {
    it('should have state with running false', (done) => {
        const gameDriver = makeDriverWorker<{ running: boolean }>(new Worker(``));
        const sources = gameDriver(new Promise((resolve) => resolve(of(makeMessage({
            key: 'running',
            value: false
        })))));
        sources.input$.subscribe((state: any) => {
            expect(state).toHaveProperty('running', false);
            done();
        });
    });
});
