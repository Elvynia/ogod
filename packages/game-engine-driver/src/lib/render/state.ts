import { BehaviorSubject, Observable, Subject, SubjectLike } from "rxjs";
import { UpdateState } from "../update/state";

export type RenderState<U = UpdateState, T = any> = [U, T];

export type Renderer<U = UpdateState, T = any> = (update: U, state: T) => void;

// FIXME: GameSubject ?
export interface RendererSubject<U = UpdateState, T = any> extends SubjectLike<RenderState<U, T>> {
    asObservable(): Observable<RenderState<U, T>>;
    get renderers$(): BehaviorSubject<Renderer<U, T>[]>;
}

export class RendererSubjectDefault<U = UpdateState, T = any> extends Subject<RenderState<U, T>> implements RendererSubject<U, T> {
    protected renderers: BehaviorSubject<Renderer<U, T>[]>;

    get renderers$(): BehaviorSubject<Renderer<U, T>[]> {
        return this.renderers;
    }

    constructor(renderers: Renderer<U, T>[] = []) {
        super();
        this.renderers = new BehaviorSubject(renderers);
    }

    override next(value: RenderState<U, T>): void {
        super.next(value);
        for (const renderer of this.renderers.value) {
            renderer(...value);
        }
    }

}
