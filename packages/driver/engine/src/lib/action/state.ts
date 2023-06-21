import { ActionHandlerDefault } from "@ogod/core";
import { Subject, SubjectLike } from "rxjs";
import { makeActionEngineHandler } from "./make";

export interface ActionSubjectChanges {
    key: string;
    mode: 'add' | 'remove';
    subject?: Subject<any>;
}

export type ActionHandlers<T> = {
    [K in keyof T]-?: T[K];
}

export interface ActionSubject<
    T,
    H = ActionHandlers<T> & ActionHandlerDefault
> extends SubjectLike<ActionSubjectChanges> {
    getHandler<K extends keyof H>(key: K): Subject<H[K] extends Subject<infer S> ? S : H[K]>;
}

export class ActionSubjectDefault<
    T,
    H = ActionHandlers<T> & ActionHandlerDefault
> extends Subject<ActionSubjectChanges> implements ActionSubject<T, H> {
    private _handlers: Record<string | keyof H, Subject<any>>;

    constructor(handlers?: T) {
        super();
        this._handlers = {
            ...handlers,
            ...makeActionEngineHandler()
        } as Record<string | keyof H, Subject<any>>;
        Object.keys(this._handlers).filter((k) => !this._handlers[k])
            .forEach((k) => this.addHandler(k));
    }

    getHandler<K extends keyof H>(key: K): Subject<H[K] extends Subject<infer S> ? S : H[K]> {
        return this._handlers[key];
    }

    protected addHandler(key: string, subject?: Subject<any>): void {
        Object.assign(this._handlers, { [key]: subject || new Subject() });
    }

    protected removeHandler(key: string): void {
        if (this._handlers[key]) {
            this._handlers[key].unsubscribe();
            delete this._handlers[key];
        }
    }

    override complete() {
        Object.values(this._handlers).forEach((h) => h.complete());
        super.complete();
    }

    override next(changes: ActionSubjectChanges): void {
        switch (changes.mode) {
            case 'add':
                this.addHandler(changes.key, changes.subject);
                break;
            case 'remove':
                this.removeHandler(changes.key);
                break;
        }
        super.next(changes);
    }
}
