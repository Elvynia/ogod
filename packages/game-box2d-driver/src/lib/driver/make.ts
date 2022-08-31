import { from, Observable, Subject, switchMap, tap } from 'rxjs';
import { makeBox2dContactListener } from '../contact/make';
import { makeGameBox2dOptions } from '../options/make';
import { GameBox2dOptions } from '../options/state';
import { Contact } from './../contact/state';
import { GameBox2DSource } from './state';

export function makeGameBox2dDriver(options: GameBox2dOptions = makeGameBox2dOptions()) {
    const contact$ = new Subject<Contact>();
    options.world!.SetContactListener(makeBox2dContactListener(contact$));
    return (sink$: Promise<Observable<number>>): GameBox2DSource => {
        console.debug('[GameBox2d] Created');
        const sub = from(sink$).pipe(
            tap(() => console.debug('[GameBox2d] Initialized')),
            switchMap((delta$) => delta$)
        ).subscribe((delta: number) => {
            options.world!.Step(delta / 1000, {
                velocityIterations: 6,
                positionIterations: 2
            });
        });
        return {
            contact$,
            dispose: () => {
                sub.unsubscribe();
                let body = options.world?.GetBodyList();
                while (body) {
                    options.world?.DestroyBody(body);
                    body = body.GetNext();
                }
                delete options.world;
                console.debug('[GameBox2d] Disposed');
            },
            instance: options.world!
        }
    }
}
