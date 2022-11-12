import { first } from 'rxjs';
import { AppReflectState } from './../state';
import { button, div, h1, h2, input, VNode } from '@cycle/dom';
import { makeWorkerMessage } from '@ogod/game-worker-driver';
import { concat, filter, from, fromEvent, map, merge, of, switchMap, tap } from 'rxjs';
import { AppSources } from "../state";

export function makeElementMenuMain() {
    return div({ props: { id: 'menu' } }, [
        h1('MENU'),
        div({ class: { content: true } }, [
            button({ props: { id: 'resume' } }, 'RESUME'),
            button({ props: { id: 'options' } }, 'OPTIONS')
        ])
    ]);
}

export function makeElementOption(label: string, values: VNode[]) {
    return div({ class: { option: true } }, [
        h2(label),
        ...values
    ]);
}

export function makeElementMenuOptions(state: AppReflectState) {
    return div({ props: { id: 'menu' } }, [
        h1('MENU - OPTIONS'),
        div({ class: { content: true } }, [
            makeElementOption('Background: ', [input({ props: { id: 'baseColor', value: state.baseColor } })]),
            makeElementOption('Gravity: ', [input({ props: { id: 'gravity', value: state.gravity }, attrs: { type: 'number' } })]),
            button({ props: { id: 'back' } }, 'Back to menu')
        ])
    ]);
}

export function makeElementMenu$(sources: AppSources) {
    const menuMain = makeElementMenuMain();
    return concat(
        of(menuMain),
        merge(
            from(sources.DOM.select('#options').element() as any).pipe(
                switchMap((el: HTMLElement) => fromEvent(el, 'click').pipe(
                    switchMap(() => sources.GameWorker.input$.pipe(
                        first()
                    ))
                )),
                map((state) => makeElementMenuOptions(state))
            ),
            from(sources.DOM.select('#back').element() as any).pipe(
                switchMap((el: HTMLElement) => fromEvent(el, 'click')),
                map(() => menuMain)
            )
        )
    )
}

export function makeListenerMenu$(sources: AppSources) {
    return merge(
        from(sources.DOM.select('#resume').events('click') as any).pipe(
            map(() => makeWorkerMessage({ key: 'paused' }))
        ),
        from(sources.DOM.select('#gravity').events('input') as any).pipe(
            map((e: any) => e.target.value),
            filter((g: string) => !!g.match(/^-?\d+\.?\d*$/)),
            map((g) => parseFloat(g)),
            map((value) => makeWorkerMessage({ key: 'gravity', value }))
        ),
        from(sources.DOM.select('#baseColor').events('input') as any).pipe(
            map((e: any) => e.target.value),
            filter((v: string) => !!v.match(/^#[0-9a-fA-F]{6}$/)),
            map((value) => makeWorkerMessage({ key: 'background', value }))
        )
    );
}
