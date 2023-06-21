import { of } from "rxjs";
import { makeDriverEngine } from './make';

describe('DriverEngine', () => {
    it('should have state with running false', (done) => {
        const gameDriver = makeDriverEngine<{ running: boolean }>();
        const sources = gameDriver(new Promise((resolve) => resolve({
            state$: of({ running: false })
        })));
        sources.state$.subscribe((state: any) => {
            expect(state).toHaveProperty('running', false);
            done();
        });
    });
});
