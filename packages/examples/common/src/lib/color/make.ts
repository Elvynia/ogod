
export function makeRandColorPart() {
    const c = Math.floor(Math.random() * 256).toString(16);
    return c.length < 2 ? '0' + c : c;
}

export function makeRandColor() {
    return `#${makeRandColorPart()}${makeRandColorPart()}${makeRandColorPart()}`;
}

export function isColorLight(color: string) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b = parseInt(hex.substring(4, 4 + 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 125;
}
