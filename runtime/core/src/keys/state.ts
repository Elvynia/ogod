import { OgodStateKey } from './../key/state';
export interface OgodStateKeys {
    active: boolean;
    values: Array<OgodStateKey>;
}

export interface OgodFeatureKeys {
    keys: OgodStateKeys;
    keys$: { [key: string]: number };
}
