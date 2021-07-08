import { OgodElementGroup } from '../../group/element';
import { OgodElementInstance } from './../element';

export interface OgodElementInGroup extends OgodElementInstance {
    group: OgodElementGroup;
    groups: string[];
}
