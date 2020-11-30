export interface Box2dElementShape extends HTMLElement {
    category: 'shape',
    x: number; // FIXME: doesn't exists in Polygon shapes. Make alias type instead of parent interface.
    y: number;
}
