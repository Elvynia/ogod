export type Driver<SI, SO> = (sink$: Promise<SI>) => SO;

export type Drivers<SO, SI extends Record<keyof SO, any>> = {
    [K in keyof SO]: Driver<SI[K], SO[K]>;
}
