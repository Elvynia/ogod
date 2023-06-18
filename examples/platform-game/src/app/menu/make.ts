import { el } from '@modern-helpers/el';
import { WorkerMessage, makeMessage } from '@ogod/core';
import { BehaviorSubject, Observable, Subject, distinctUntilChanged, filter, first, fromEvent, map, merge, switchMap, tap } from 'rxjs';
import { AppSources } from "../state";
import { AppReflectState } from './../state';
import { MenuState } from './state';

export function makeElementOption(label: string, values: HTMLElement[]) {
    return el('div', { className: 'option' }, [
        el('h2', undefined, [label]),
        ...values
    ]);
}

export function makeElementMenuOptions(menuEl: HTMLElement, menuState: Subject<MenuState>) {
    const backBtn = el('button', { className: 'ui-btn' }, ['Back to menu']);
    const gravityInput = el('input', {
        attributes: [
            ['id', 'gravity'],
            ['type', 'number']
        ]
    }) as HTMLInputElement;
    const colorInput = el('input', {
        attributes: [
            ['id', 'baseColor'],
        ]
    }) as HTMLInputElement;
    const optionsEl = el('div', { className: 'menu' }, [
        el('h1', undefined, ['MENU - OPTIONS']),
        el('div', { className: 'content' }, [
            makeElementOption('Background: ', [colorInput]),
            makeElementOption('Gravity: ', [gravityInput]),
            backBtn
        ])
    ]);
    fromEvent(backBtn, 'click').subscribe(() => {
        menuEl.removeAttribute('hidden');
        optionsEl.remove();
        menuState.next('main');
    });
    return {
        element: optionsEl,
        update: (state: AppReflectState) => {
            colorInput.value = state.baseColor;
            gravityInput.valueAsNumber = state.gravity;
        },
        messages: [
            fromEvent(gravityInput, 'input').pipe(
                map((e: any) => e.target.value),
                filter((g: string) => !!g.match(/^-?\d+\.?\d*$/)),
                map((g) => parseFloat(g)),
                map((value) => makeMessage({ key: 'gravity', value }))
            ),
            fromEvent(colorInput, 'input').pipe(
                map((e: any) => e.target.value),
                filter((v: string) => !!v.match(/^#[0-9a-fA-F]{6}$/)),
                map((value) => makeMessage({ key: 'background', value }))
            )
        ]
    }
}

export function makeElementMenu(sources: AppSources, wrapperEl: HTMLElement): Observable<WorkerMessage> {
    const menuState = new BehaviorSubject<MenuState>(null);
    const resumeBtn = el('button', { className: 'ui-btn' }, ['RESUME']);
    const optionsBtn = el('button', { className: 'ui-btn' }, ['OPTIONS']);
    const menuEl = el('div', { className: 'menu' }, [
        el('h1', undefined, ['MENU']),
        el('div', { className: 'content' }, [
            resumeBtn,
            optionsBtn
        ])
    ]);
    const menuOptions = makeElementMenuOptions(menuEl, menuState);
    fromEvent(optionsBtn, 'click').pipe(
        switchMap(() => sources.Worker.input$.pipe(
            first()
        ))
    ).subscribe((state) => {
        menuOptions.update(state);
        menuEl.setAttribute('hidden', '');
        wrapperEl.appendChild(menuOptions.element);
        menuState.next('options');
    });
    sources.Worker.input$.pipe(
        map((s) => s.paused),
        distinctUntilChanged(),
        filter((p) => p)
    ).subscribe(() => {
        wrapperEl.appendChild(menuEl);
        menuState.next('main');
    });
    return merge(
        merge(
            fromEvent(document, 'keyup').pipe(
                filter((e: KeyboardEvent) => e.code === 'Escape'),
                switchMap(() => menuState.pipe(
                    first(),
                    filter((ms) => {
                        if (ms === 'main') {
                            menuEl.remove();
                            menuState.next(null);
                        } else if (ms === 'options') {
                            menuEl.removeAttribute('hidden');
                            menuOptions.element.remove();
                            menuState.next('main');
                            return false;
                        }
                        return true;
                    })
                ))
            ),
            fromEvent(resumeBtn, 'click').pipe(
                tap(() => {
                    menuEl.remove();
                    menuState.next(null);
                })
            )).pipe(
                map(() => makeMessage({ key: 'paused' }))
            ),
        ...menuOptions.messages
    );
}
