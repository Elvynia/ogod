export interface Loading {
    progress: number;
    message: string;
}

export type LoadingState = Record<string, Loading>;
