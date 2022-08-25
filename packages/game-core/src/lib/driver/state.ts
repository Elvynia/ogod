import { Observable } from 'rxjs';

export type Driver<SI extends Observable<any>, SO> = (sink$: Promise<SI>) => SO;
