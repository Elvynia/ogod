export function randNum(length: number = 4): number {
    return Math.floor(Math.random() * Math.pow(10, length));
}

export function randColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
}
