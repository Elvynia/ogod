import { concatMap, firstValueFrom, lastValueFrom, of } from "rxjs";
import { makeGameDriver } from './game-engine-driver';

describe('gameDriver', () => {
    const gameDriver = makeGameDriver();
    it('should have state with running false', () => {
        const sources = gameDriver(of({
            running: of(false)
        }) as any);
        expect(firstValueFrom(sources.game$)).resolves.toHaveProperty('running', false);
    });
    it('should have state with running true', () => {
        const sources = gameDriver(of({
            running: of(false).pipe(
                concatMap(() => of(true))
            )
        }) as any);
        expect(lastValueFrom(sources.game$)).resolves.toHaveProperty('running', true);
    });
});
