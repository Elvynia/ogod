import { OgodRuntimeEngine } from "../engine/runtime";

declare var self: OgodRuntimeEngine;

export function ogodFetch(path: string) {
    return fetch((self.baseHref + path).replace(/\/\//g, '/'));
}
