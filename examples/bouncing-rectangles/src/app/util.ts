export const clampMag = (value: number, min: number, max: number) => {
    let val = Math.abs(value);
    let sign = value < 0 ? -1 : 1;
    if (min <= val && val <= max) {
        return value;
    }
    if (min > val) {
        return sign * min;
    }
    if (max < val) {
        return sign * max;
    }
};

export const runBoundaryCheck = (obj: any, width: number, height: number): string => {
    let boundaryHit = '';
    if (obj.x + obj.width > width) {
        boundaryHit = 'right';
        obj.x = width - obj.width;
    } else if (obj.x < 0) {
        boundaryHit = 'left';
        obj.x = 0;
    }
    if (obj.y + obj.height >= height) {
        boundaryHit = 'bottom';
        obj.y = height - obj.height;
    } else if (obj.y < 0) {
        boundaryHit = 'top';
        obj.y = 0;
    }
    return boundaryHit;
};
