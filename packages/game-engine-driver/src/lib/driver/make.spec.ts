import { of } from "rxjs";
import { makeDriverGameEngine } from './make';

describe('DriverGameEngine', () => {
    it('should have state with running false', (done) => {
        const gameDriver = makeDriverGameEngine<{ running: boolean }>();
        const sources = gameDriver(new Promise((resolve) => resolve({
            feature$: of({ running: false })
        })));
        sources.state$.subscribe((state: any) => {
            expect(state).toHaveProperty('running', false);
            done();
        });
    });
});
