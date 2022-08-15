import 'symbol-observable';
import { concatMap, last, of } from "rxjs";
import xs from 'xstream';
import { makeGameEngineDriver } from './make-driver';

describe('gameDriver', () => {
    const gameDriver = makeGameEngineDriver();
    it('should have state with running false', (done) => {
        const sources = gameDriver(xs.of({
            running: of(false)
        }) as any);
        sources.game$.subscribe((state: any) => {
            expect(state).toHaveProperty('running', false);
            done();
        });
    });
    it('should have state with running true', (done) => {
        const sources = gameDriver(xs.of({
            running: of(false).pipe(
                concatMap(() => of(true))
            )
        }) as any);
        sources.game$.pipe(
            last()
        ).subscribe((state: any) => {
            expect(state).toHaveProperty('running', true);
            done();
        });
    });
});
