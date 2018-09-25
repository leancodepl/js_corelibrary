export interface Token {
    token: string;
    refreshToken: string;
    expirationDate: Date;
    abc?: string;
}

export type TokenStorage = SyncTokenStorage | AsyncTokenStorage;

export interface SyncTokenStorage {
    getToken(): Token | null;
    storeToken(token: Token): void;
    resetToken(): void;
    sync: true;
}

export interface AsyncTokenStorage {
    getToken(): Promise<Token | null>;
    storeToken(token: Token): Promise<void>;
    resetToken(): Promise<void>;
    sync: false;
}
