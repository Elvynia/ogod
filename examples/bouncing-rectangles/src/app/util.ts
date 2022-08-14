import { FrameData } from '@ogod/game-engine-driver';

export const clampMag = (value: number, min: number, max: number) => {
  let val = Math.abs(value);
  let sign = value < 0 ? -1 : 1;
  if(min <= val && val <= max) {
    return value;
  }
  if(min > val) {
    return sign*min;
  }
  if(max < val) {
    return sign*max;
  }
};

export const runBoundaryCheck = (obj: any, boundaries: {top: number, right: number, bottom: number, left: number}): string => {
  let boundaryHit = '';
  if (obj.x + obj.width > boundaries.right) {
    boundaryHit = 'right';
    //obj.velocity.x *= - bounceRateChanges.right;
    obj.x = boundaries.right - obj.width;
  } else if (obj.x < boundaries.left) {
    //obj.velocity.x *= -bounceRateChanges.left;
    boundaryHit = 'left';
    obj.x = boundaries.left;
  }
  if(obj.y + obj.height >= boundaries.bottom) {        
    //obj.velocity.y *= -bounceRateChanges.bottom;
    boundaryHit = 'bottom';
    obj.y = boundaries.bottom - obj.height;
  } else if (obj.y < boundaries.top) {
    //obj.velocity.y *= -bounceRateChanges.top;
    boundaryHit = 'top';
    obj.y = boundaries.top;
  }
  return boundaryHit;
};
