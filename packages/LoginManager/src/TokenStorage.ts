export interface Token {
    token: string;
    refreshToken: string;
    expirationDate: Date;
}

export type TokenStorage = SyncTokenStorage | AsyncTokenStorage;

export interface SyncTokenStorage {
    getToken(): Token | null;
    storeToken(token: Token): void;
    resetToken(): void;
}

export interface AsyncTokenStorage {
    getToken(): Promise<Token | null>;
    storeToken(token: Token): Promise<void>;
    resetToken(): Promise<void>;
}
