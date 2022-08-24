import { last, of, tap } from "rxjs";
import { makeGameEngineDriver } from './make';

describe('gameDriver', () => {
    it('should have state with running false', (done) => {
        const gameDriver = makeGameEngineDriver({ running: false });
        const sources = gameDriver(of({
            running: of(false)
        }) as any);
        sources.state$.subscribe((state: any) => {
            expect(state).toHaveProperty('running', false);
            done();
        });
    });
    it('should have state with running true', (done) => {
        const gameDriver = makeGameEngineDriver({ running: false });
        const sources = gameDriver(of({
            running: of(false, true)
        }) as any);
        sources.state$.pipe(
            tap((state) => console.debug(state)),
            last()
        ).subscribe((state: any) => {
            expect(state).toHaveProperty('running', true);
            done();
        });
    });
});
