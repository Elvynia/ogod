import { MonoTypeOperatorFunction, Observable } from "rxjs";

export function distinctState<T, V>(params: {
    resolver: (state: T) => V,
    initialValue?: V
} | ((state: T) => V)): MonoTypeOperatorFunction<T> {
    return (source) => new Observable((subscriber) => {
        const resolver = typeof params === 'object' ? params.resolver : params;
        let initialValue = typeof params === 'object' ? params.initialValue : undefined;
        const sub = source.subscribe({
            next: (value) => {
                const nextValue = resolver(value);
                if (initialValue !== nextValue) {
                    initialValue = nextValue;
                    subscriber.next(value);
                }
            },
            error: (e) => subscriber.error(e),
            complete: () => subscriber.complete()
        });
        return () => sub.unsubscribe();
    });
}
