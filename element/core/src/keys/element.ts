import { OgodElementKey } from './../key/element';

export interface OgodElementKeys extends HTMLElement {
    category: string;
    values: OgodElementKey[];
    active: boolean;
}

export interface OgodInstanceKeys extends HTMLElement {
    keys: OgodElementKeys[];
}
