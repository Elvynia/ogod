import { makeGameBox2dDriver } from './make';

describe('gameBox2dDriver', () => {
  it('should work', () => {
    expect(makeGameBox2dDriver()).toEqual('game-box2d-driver');
  });
});
