export type Driver<SI, SO> = (sink$: Promise<SI>) => SO;
