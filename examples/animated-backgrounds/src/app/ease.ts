export function easeLinear(t, b, _c, d) {
    var c = _c - b;
    return c * t / d + b;
}

export function easeInElastic(t, b, _c, d) {
    var c = _c - b;
    var a, p, s;
    s = 1.70158;
    p = 0;
    a = c;
    if (t === 0) {
        return b;
    } else if ((t /= d) === 1) {
        return b + c;
    }
    if (!p) {
        p = d * 0.3;
    }
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
}
