import { ogodReducerSystem } from './system/reducer';
import { ogodReducerScene } from './scene/reducer';
import { ogodReducerInstance } from './instance/reducer';
import { ogodReducerResource } from './resource/reducer';

export const ogodReducers = {
    system: ogodReducerSystem(),
    scene: ogodReducerScene(),
    instance: ogodReducerInstance(),
    resource: ogodReducerResource()
};
