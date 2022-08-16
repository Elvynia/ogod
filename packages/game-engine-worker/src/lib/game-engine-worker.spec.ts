import { gameEngineWorker } from './game-engine-worker';

describe('gameEngineWorker', () => {
  it('should work', () => {
    expect(gameEngineWorker()).toEqual('game-engine-worker');
  });
});
