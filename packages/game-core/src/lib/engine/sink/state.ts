import { Observable } from 'rxjs';
import { ComplexFeature, Feature } from '../../feature/state';
import { ReflectFunction } from '../../reflector/state';
import { Renderer } from '../../renderer/state';

export interface GameEngineSink<S = any, K extends string = keyof S & string> {
    runtime$: Observable<Feature<K> | ComplexFeature<K>>;
    reflector$?: Observable<ReflectFunction>;
    renderer$?: Observable<Renderer<S>>;
}
