import { WorkerAction } from "@ogod/game-core";
import { Subject, SubjectLike } from "rxjs";
import { makeActionEngineHandler } from "./make";

export interface ActionSubjectChanges<A extends string = string> {
    key: A;
    mode: 'add' | 'remove';
    subject?: Subject<any>;
}

export type ActionHandlers<A extends string = string, W extends WorkerAction<A> = WorkerAction<A>>
    = { [k in A | 'engine']: Subject<W['value']> };

export interface ActionSubject<A extends string = string>
    extends SubjectLike<ActionSubjectChanges<A>> {
    handlers: ActionHandlers<A>;
}

export interface ActionSubjectParams<A extends string = string> {
    handlers?: Partial<ActionHandlers<A>>;
    keys?: ReadonlyArray<A>;
};

export class ActionSubjectDefault<A extends string = string, W extends WorkerAction<A> = WorkerAction<A>>
    extends Subject<ActionSubjectChanges<A>> implements ActionSubject<A> {
    private _handlers: ActionHandlers<A>;

    get handlers(): Readonly<ActionHandlers<A>> {
        return this._handlers;
    }

    constructor(params?: ActionSubjectParams<A>) {
        super();
        this._handlers = makeActionEngineHandler() as ActionHandlers<A>;
        if (params?.handlers) {
            Object.assign(this._handlers, params.handlers);
        }
        if (params?.keys) {
            params.keys.map((key) => ({ [key]: new Subject<any>() }))
                .reduce((handlers, handler) => Object.assign(handlers, handler), this._handlers);
        }
    }

    protected addHandler(key: W["key"], subject: Subject<W["value"]> = new Subject()): void {
        this._handlers[key] = subject;
    }

    protected removeHandler(key: W["key"]): void {
        this.handlers[key].unsubscribe();
        // FIXME: delete on readonly getter not raising error.
        delete this.handlers[key];
    }

    override next(changes: ActionSubjectChanges<A>): void {
        switch (changes.mode) {
            case 'add':
                this.addHandler(changes.key, changes.subject);
                break;
            case 'remove':
                this.removeHandler(changes.key);
        }
    }
}