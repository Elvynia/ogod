import { Subject } from 'rxjs';
import { Stream } from 'xstream';
import { makeBox2dContactListener } from '../contact/make';
import { makeGameBox2dOptions } from '../options/make';
import { GameBox2dOptions } from '../options/state';
import { Contact } from './../contact/state';
import { GameBox2DSource } from './state';

export function makeGameBox2dDriver(options: GameBox2dOptions = makeGameBox2dOptions()) {
    const contact$ = new Subject<Contact>();
    options.world.SetContactListener(makeBox2dContactListener(contact$));
    return (sink$: Stream<number>): GameBox2DSource => {
        // const sub = sink$.subscribe((delta: number) => {

        // })
        return {
            contact$,
            dispose: () => {
                // sub.unsubscribe();
            },
            world: options.world
        }
    }
}
