export interface Loading {
    progress: number;
    message: string;
}

export interface LoadingState {
    [key: string]: Loading;
}
