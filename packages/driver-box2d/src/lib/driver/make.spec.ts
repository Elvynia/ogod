import { makeDriverBox2d } from './make';

describe('DriverBox2d', () => {
  it('should work', () => {
    expect(makeDriverBox2d()).toEqual('driver-box2d');
  });
});
