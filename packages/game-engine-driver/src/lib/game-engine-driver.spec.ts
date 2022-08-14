import 'symbol-observable';
import { concatMap, of, last } from "rxjs";
import xs from 'xstream';
import { makeGameDriver } from './game-engine-driver';

describe('gameDriver', () => {
    const gameDriver = makeGameDriver();
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
