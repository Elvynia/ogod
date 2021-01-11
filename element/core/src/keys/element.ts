import { OgodElementKey } from './../key/element';

export interface OgodElementKeys extends HTMLElement {
    category: string;
    values: OgodElementKey[];
    active: boolean;
}

export interface OgodElementInstanceKeys extends HTMLElement {
    keys: OgodElementKeys[];
}
